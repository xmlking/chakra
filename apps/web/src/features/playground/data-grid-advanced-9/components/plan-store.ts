import { type DataGridRowStatus } from "@workspace/ui/components/reui/data-grid/data-grid";
import { useCallback, useMemo, useRef, useState } from "react";

import { KITCHENS, VISITS, type Kitchen, type KitchenDraft, type Visit } from "./data";
import { isOpen } from "./plan-math";

interface Snapshot {
  kitchens: Kitchen[];
  visits: Visit[];
}

/** Applies upserts and removals by id; returns the list and what it replaced. */
function patch<T extends { id: string }>(list: T[], upserts: T[], removeIds: string[]) {
  const before = new Map<string, T | undefined>();
  const byId = new Map(list.map((item) => [item.id, item]));
  for (const item of upserts) before.set(item.id, byId.get(item.id));
  for (const id of removeIds) before.set(id, byId.get(id));
  const removed = new Set(removeIds);
  const upsertById = new Map(upserts.map((item) => [item.id, item]));
  const next = list
    .filter((item) => !removed.has(item.id))
    .map((item) => upsertById.get(item.id) ?? item);
  // New records lead, the way a created row shows first.
  const created = upserts.filter((item) => !byId.has(item.id));
  return { next: [...created, ...next], before };
}

/** Puts every touched id back the way it was: gone if it was new. */
function restore<T extends { id: string }>(list: T[], before: Map<string, T | undefined>) {
  const drop = new Set([...before].filter(([, item]) => item === undefined).map(([id]) => id));
  const back = new Map([...before].flatMap(([id, item]) => (item ? [[id, item] as const] : [])));
  const present = new Set(list.map((item) => item.id));
  const kept = list.filter((item) => !drop.has(item.id)).map((item) => back.get(item.id) ?? item);
  const missing = [...back.values()].filter((item) => !present.has(item.id));
  return [...missing, ...kept];
}

export interface PlanStore {
  kitchens: Kitchen[];
  visits: Visit[];
  kitchenById: Map<string, Kitchen>;
  visitsByKitchen: Map<string, Visit[]>;
  /** Kitchens added or edited this session, tinted in the grid. */
  marks: Record<string, DataGridRowStatus>;
  nextVisitId: () => string;
  writeVisits: (upserts: Visit[], removeIds?: string[]) => { undo: () => void };
  createKitchen: (draft: KitchenDraft) => { kitchen: Kitchen; undo: () => void };
  /** A dropped service takes its open visits with it. */
  updateKitchen: (
    id: string,
    draft: KitchenDraft,
  ) => { kitchen: Kitchen; cancelled: Visit[]; undo: () => void } | null;
  removeKitchens: (ids: string[]) => {
    removed: Kitchen[];
    visitCount: number;
    undo: () => void;
  };
}

export function usePlanStore(): PlanStore {
  const [snapshot, setSnapshot] = useState<Snapshot>({
    kitchens: KITCHENS,
    visits: VISITS,
  });
  // Writes chain within one handler, so each reads the newest state.
  const latest = useRef(snapshot);
  const sequence = useRef(1);
  const [marks, setMarks] = useState<Record<string, DataGridRowStatus>>({});
  const latestMarks = useRef(marks);

  const commit = useCallback((next: Snapshot) => {
    latest.current = next;
    setSnapshot(next);
  }, []);

  const mark = useCallback((id: string, status: DataGridRowStatus | undefined) => {
    const next = { ...latestMarks.current };
    if (status) next[id] = status;
    else delete next[id];
    latestMarks.current = next;
    setMarks(next);
  }, []);

  const nextVisitId = useCallback(() => `vis_new_${sequence.current++}`, []);

  const writeVisits = useCallback<PlanStore["writeVisits"]>(
    (upserts, removeIds = []) => {
      const { next, before } = patch(latest.current.visits, upserts, removeIds);
      commit({ ...latest.current, visits: next });
      return {
        undo: () =>
          commit({
            ...latest.current,
            visits: restore(latest.current.visits, before),
          }),
      };
    },
    [commit],
  );

  const createKitchen = useCallback<PlanStore["createKitchen"]>(
    (draft) => {
      const kitchen: Kitchen = {
        id: `kit_new_${sequence.current++}`,
        name: draft.name.trim(),
        address: draft.address.trim(),
        managerId: draft.managerId,
        volume: draft.volume,
        services: [...draft.services],
        // The dates the form was given; a service without one is due today.
        priorDone: Object.fromEntries(
          draft.services.flatMap((service) => {
            const day = draft.priorDone[service];
            return day ? [[service, day]] : [];
          }),
        ),
      };
      const { next, before } = patch(latest.current.kitchens, [kitchen], []);
      commit({ ...latest.current, kitchens: next });
      mark(kitchen.id, "new");
      return {
        kitchen,
        undo: () => {
          commit({
            ...latest.current,
            kitchens: restore(latest.current.kitchens, before),
          });
          mark(kitchen.id, undefined);
        },
      };
    },
    [commit, mark],
  );

  const updateKitchen = useCallback<PlanStore["updateKitchen"]>(
    (id, draft) => {
      const current = latest.current.kitchens.find((item) => item.id === id);
      if (!current) return null;
      const kitchen: Kitchen = {
        ...current,
        name: draft.name.trim(),
        address: draft.address.trim(),
        managerId: draft.managerId,
        volume: draft.volume,
        services: [...draft.services],
      };
      const kept = new Set(draft.services);
      const cancelled = latest.current.visits.filter(
        (visit) => visit.kitchenId === id && isOpen(visit) && !kept.has(visit.service),
      );
      const kitchens = patch(latest.current.kitchens, [kitchen], []);
      const visits = patch(
        latest.current.visits,
        [],
        cancelled.map((visit) => visit.id),
      );
      commit({ kitchens: kitchens.next, visits: visits.next });
      const previousMark = latestMarks.current[id];
      // A kitchen added this session stays "new" through its edits.
      if (previousMark !== "new") mark(id, "dirty");
      return {
        kitchen,
        cancelled,
        undo: () => {
          commit({
            kitchens: restore(latest.current.kitchens, kitchens.before),
            visits: restore(latest.current.visits, visits.before),
          });
          mark(id, previousMark);
        },
      };
    },
    [commit, mark],
  );

  const removeKitchens = useCallback<PlanStore["removeKitchens"]>(
    (ids) => {
      const wanted = new Set(ids);
      const removed = latest.current.kitchens.filter((item) => wanted.has(item.id));
      const gone = latest.current.visits.filter((visit) => wanted.has(visit.kitchenId));
      // Positions are kept, so an undo puts each kitchen back where it was.
      const positions = latest.current.kitchens
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => wanted.has(item.id));
      const visits = patch(
        latest.current.visits,
        [],
        gone.map((visit) => visit.id),
      );
      commit({
        kitchens: latest.current.kitchens.filter((item) => !wanted.has(item.id)),
        visits: visits.next,
      });
      return {
        removed,
        visitCount: gone.length,
        undo: () => {
          const kitchens = [...latest.current.kitchens];
          for (const { item, index } of positions)
            kitchens.splice(Math.min(index, kitchens.length), 0, item);
          commit({
            kitchens,
            visits: restore(latest.current.visits, visits.before),
          });
        },
      };
    },
    [commit],
  );

  const kitchenById = useMemo(
    () => new Map(snapshot.kitchens.map((item) => [item.id, item])),
    [snapshot.kitchens],
  );

  const visitsByKitchen = useMemo(() => {
    const map = new Map<string, Visit[]>();
    for (const visit of snapshot.visits) {
      const list = map.get(visit.kitchenId);
      if (list) list.push(visit);
      else map.set(visit.kitchenId, [visit]);
    }
    return map;
  }, [snapshot.visits]);

  return {
    kitchens: snapshot.kitchens,
    visits: snapshot.visits,
    kitchenById,
    visitsByKitchen,
    marks,
    nextVisitId,
    writeVisits,
    createKitchen,
    updateKitchen,
    removeKitchens,
  };
}
