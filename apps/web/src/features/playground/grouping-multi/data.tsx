// Bill of materials for one finished unit of a fictional cargo e-bike.
// Raw values only: quantity is per-parent, cost is per-unit, lead time is in days.
// Every rolled-up number (effective quantity, extended cost, critical path, worst
// supply status) derives in `buildBomRows`, never in the data. Revision C, 24 Jul 2026.

import {
  ActivityIcon,
  ArchiveIcon,
  ArrowLeftRightIcon,
  ArrowLeftToLineIcon,
  CircleIcon,
  Columns3Icon,
  CpuIcon,
  DatabaseIcon,
  FactoryIcon,
  FlameIcon,
  FlaskConicalIcon,
  GitBranchIcon,
  GripHorizontalIcon,
  InboxIcon,
  KeyRoundIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LifeBuoyIcon,
  LinkIcon,
  Loader2Icon,
  LockKeyholeIcon,
  Maximize2Icon,
  Minimize2Icon,
  MinusIcon,
  MonitorIcon,
  PackageIcon,
  PauseCircleIcon,
  PieChartIcon,
  Pin,
  PlugZapIcon,
  PuzzleIcon,
  RadioIcon,
  RepeatIcon,
  RocketIcon,
  RotateCcwIcon,
  RouteIcon,
  Settings2Icon,
  SettingsIcon,
  Share2Icon,
  TargetIcon,
  TruckIcon,
  WrenchIcon,
  ZapIcon,
} from "lucide-react";
import { type ReactNode } from "react";

export type BomNodeKind = "system" | "assembly" | "part";

export type SupplyStatus = "Stocked" | "Single source" | "Long lead" | "Shortage";

export interface BomNode {
  id: string;
  partNumber: string;
  name: string;
  /** One-line spec, shown only when the part detail switch is on. */
  detail: string;
  kind: BomNodeKind;
  /** Units of this node consumed by one unit of its parent. */
  qty: number;
  /** Purchased cost per unit. Null on nodes that are built, not bought. */
  unitCost: number | null;
  /** Procurement lead time in days. Null on built nodes. */
  leadTimeDays: number | null;
  supply: SupplyStatus | null;
  supplier: string | null;
  children?: BomNode[];
}

/** One BOM node with every tree-derived measure resolved. */
export interface BomRow {
  id: string;
  node: BomNode;
  /** Quantity per finished unit: this node's qty times every ancestor's qty. */
  effectiveQty: number;
  /** Rolled-up purchased cost of this node and everything under it. */
  extendedCost: number;
  /** Longest lead time anywhere in this subtree, the critical path. */
  leadTimeDays: number;
  /** Most severe supply status anywhere in this subtree. */
  supply: SupplyStatus;
  /** Number of purchased parts in this subtree. */
  partCount: number;
  children?: BomRow[];
}

export const PRODUCT_NAME = "Meridian C2 Cargo";
export const BOM_REVISION = "Rev C · 24 Jul 2026";

export const SUPPLY_STATUS_OPTIONS: SupplyStatus[] = [
  "Stocked",
  "Single source",
  "Long lead",
  "Shortage",
];

// Severity order, used to roll the worst descendant status onto a parent, and
// exported so the Supply column sorts on risk rather than on the alphabet. The
// badge tone map in columns.tsx must stay in this same order, or a rolled-up
// parent will read calmer than the child that produced it.
export const SUPPLY_SEVERITY: Record<SupplyStatus, number> = {
  Stocked: 0,
  "Single source": 1,
  "Long lead": 2,
  Shortage: 3,
};

// Static icon nodes per node kind, used as the fallback for any node the map
// below does not name. Icon names must stay literal, so the whole element lives
// in data and the column renders it as-is.
export const BOM_KIND_ICONS: Record<BomNodeKind, ReactNode> = {
  system: <LayersIcon aria-hidden="true" />,
  assembly: <PackageIcon aria-hidden="true" />,
  part: <WrenchIcon aria-hidden="true" />,
};

// Per-node glyph, so a column of 44 rows does not repeat one icon. The catalog
// is a general app icon set with no mechanical parts, so these are literal where
// one exists (chain, plug, monitor, tyre) and an honest abstraction otherwise
// (concentric rings for a stator, stacked discs for a cassette). Nodes with no
// entry fall back to BOM_KIND_ICONS.
export const BOM_NODE_ICONS: Record<string, ReactNode> = {
  // drive system
  "sys-100": <SettingsIcon aria-hidden="true" />,
  // rotating power
  "asm-110": <RocketIcon aria-hidden="true" />,
  // concentric windings
  "sub-111": <TargetIcon aria-hidden="true" />,
  // laminated core
  "prt-1111": <LayersIcon aria-hidden="true" />,
  // winding path
  "prt-1112": <RouteIcon aria-hidden="true" />,
  // thermal
  "prt-1113": <FlameIcon aria-hidden="true" />,
  // rotation
  "sub-112": <Loader2Icon aria-hidden="true" />,
  // collar and stem
  "prt-1121": <KeyRoundIcon aria-hidden="true" />,
  // radiating field
  "prt-1122": <RadioIcon aria-hidden="true" />,
  // enclosing shell
  "prt-113": <PackageIcon aria-hidden="true" />,
  // sensor trace
  "prt-114": <ActivityIcon aria-hidden="true" />,
  // chain loop
  "asm-120": <RepeatIcon aria-hidden="true" />,
  // toothed cog
  "prt-121": <Settings2Icon aria-hidden="true" />,
  // chain links
  "prt-122": <LinkIcon aria-hidden="true" />,
  // stacked sprockets
  "prt-123": <DatabaseIcon aria-hidden="true" />,
  // energy
  "sys-200": <ZapIcon aria-hidden="true" />,
  // cell block
  "asm-210": <ArchiveIcon aria-hidden="true" />,
  // cylindrical cell
  "prt-211": <FlaskConicalIcon aria-hidden="true" />,
  // pocket grid
  "prt-212": <LayoutGridIcon aria-hidden="true" />,
  // nickel strips
  "prt-213": <Columns3Icon aria-hidden="true" />,
  // controller board
  "prt-220": <CpuIcon aria-hidden="true" />,
  // lock barrel
  "prt-230": <LockKeyholeIcon aria-hidden="true" />,
  // charge inlet
  "prt-240": <PlugZapIcon aria-hidden="true" />,
  // structural outline
  "sys-300": <Maximize2Icon aria-hidden="true" />,
  // welded fabrication
  "asm-310": <FactoryIcon aria-hidden="true" />,
  // tube triangle
  "prt-311": <GitBranchIcon aria-hidden="true" />,
  // joined nodes
  "prt-312": <Share2Icon aria-hidden="true" />,
  // press fit
  "prt-313": <PuzzleIcon aria-hidden="true" />,
  // deck tray
  "prt-320": <InboxIcon aria-hidden="true" />,
  // plants into ground
  "prt-330": <Pin aria-hidden="true" />,
  // rider controls
  "sys-400": <LayoutDashboardIcon aria-hidden="true" />,
  // display
  "prt-410": <MonitorIcon aria-hidden="true" />,
  // levers
  "prt-420": <ArrowLeftToLineIcon aria-hidden="true" />,
  // bar across
  "prt-430": <ArrowLeftRightIcon aria-hidden="true" />,
  // grips
  "prt-440": <GripHorizontalIcon aria-hidden="true" />,
  // rolling gear
  "sys-500": <TruckIcon aria-hidden="true" />,
  // wheel rotation
  "asm-510": <RotateCcwIcon aria-hidden="true" />,
  // rim
  "prt-511": <PieChartIcon aria-hidden="true" />,
  // thin rod
  "prt-512": <MinusIcon aria-hidden="true" />,
  // machined component
  "prt-513": <WrenchIcon aria-hidden="true" />,
  // treaded ring
  "prt-514": <LifeBuoyIcon aria-hidden="true" />,
  // stopping
  "asm-520": <PauseCircleIcon aria-hidden="true" />,
  // clamping inward
  "prt-521": <Minimize2Icon aria-hidden="true" />,
  // brake disc
  "prt-522": <CircleIcon aria-hidden="true" />,
};

// customize: swap this tree for your own product structure. Nodes are
// self-recursive, so depth is whatever your data has; ids must be globally
// unique because `getRowId` returns them flat across every level.
export const BOM_TREE: BomNode[] = [
  {
    id: "sys-100",
    partNumber: "SYS-100",
    name: "Drive System",
    detail: "Mid-drive motor and chain transmission",
    kind: "system",
    qty: 1,
    unitCost: null,
    leadTimeDays: null,
    supply: null,
    supplier: null,
    children: [
      {
        id: "asm-110",
        partNumber: "ASM-110",
        name: "Mid-Drive Motor",
        detail: "250 W nominal, 85 Nm peak torque",
        kind: "assembly",
        qty: 1,
        unitCost: null,
        leadTimeDays: null,
        supply: null,
        supplier: null,
        children: [
          {
            id: "sub-111",
            partNumber: "SUB-111",
            name: "Stator Assembly",
            detail: "Wound and potted before motor build",
            kind: "assembly",
            qty: 1,
            unitCost: null,
            leadTimeDays: null,
            supply: null,
            supplier: null,
            children: [
              {
                id: "prt-1111",
                partNumber: "PRT-1111",
                name: "Stator Lamination",
                detail: "Grain-oriented silicon steel, 0.35 mm",
                kind: "part",
                qty: 52,
                unitCost: 0.74,
                leadTimeDays: 45,
                supply: "Single source",
                supplier: "Kestrel Magnetics",
              },
              {
                id: "prt-1112",
                partNumber: "PRT-1112",
                name: "Copper Winding",
                detail: "Class H enamel, 1.2 mm gauge",
                kind: "part",
                qty: 3,
                unitCost: 7.4,
                leadTimeDays: 28,
                supply: "Stocked",
                supplier: "Halden Wire Works",
              },
              {
                id: "prt-1113",
                partNumber: "PRT-1113",
                name: "Thermal Sensor",
                detail: "NTC 10k, potted lead",
                kind: "part",
                qty: 2,
                unitCost: 3.85,
                leadTimeDays: 21,
                supply: "Stocked",
                supplier: "Orbit Sensing",
              },
            ],
          },
          {
            id: "sub-112",
            partNumber: "SUB-112",
            name: "Rotor Assembly",
            detail: "Balanced to 8000 rpm before press-fit",
            kind: "assembly",
            qty: 1,
            unitCost: null,
            leadTimeDays: null,
            supply: null,
            supplier: null,
            children: [
              {
                id: "prt-1121",
                partNumber: "PRT-1121",
                name: "Rotor Shaft",
                detail: "Hardened 4140, ground finish",
                kind: "part",
                qty: 1,
                unitCost: 16.9,
                leadTimeDays: 35,
                supply: "Stocked",
                supplier: "Norwood Precision",
              },
              {
                id: "prt-1122",
                partNumber: "PRT-1122",
                name: "Magnet Segment",
                detail: "Sintered neodymium, N45SH grade",
                kind: "part",
                qty: 16,
                unitCost: 2.6,
                leadTimeDays: 62,
                supply: "Shortage",
                supplier: "Kestrel Magnetics",
              },
            ],
          },
          {
            id: "prt-113",
            partNumber: "PRT-113",
            name: "Motor Housing",
            detail: "Die-cast half shell, powder coated",
            kind: "part",
            qty: 2,
            unitCost: 13.9,
            leadTimeDays: 30,
            supply: "Stocked",
            supplier: "Norwood Precision",
          },
          {
            id: "prt-114",
            partNumber: "PRT-114",
            name: "Torque Sensor Ring",
            detail: "Strain gauge bridge, calibrated",
            kind: "part",
            qty: 1,
            unitCost: 34.75,
            leadTimeDays: 40,
            supply: "Single source",
            supplier: "Orbit Sensing",
          },
        ],
      },
      {
        id: "asm-120",
        partNumber: "ASM-120",
        name: "Drivetrain",
        detail: "Chain drive with wide-range cassette",
        kind: "assembly",
        qty: 1,
        unitCost: null,
        leadTimeDays: null,
        supply: null,
        supplier: null,
        children: [
          {
            id: "prt-121",
            partNumber: "PRT-121",
            name: "Chainring 42T",
            detail: "Narrow-wide profile, 7075 alloy",
            kind: "part",
            qty: 1,
            unitCost: 18.3,
            leadTimeDays: 24,
            supply: "Stocked",
            supplier: "Calder Drivetrain",
          },
          {
            id: "prt-122",
            partNumber: "PRT-122",
            name: "Chain",
            detail: "11-speed, nickel plated",
            kind: "part",
            qty: 1,
            unitCost: 12.75,
            leadTimeDays: 18,
            supply: "Stocked",
            supplier: "Calder Drivetrain",
          },
          {
            id: "prt-123",
            partNumber: "PRT-123",
            name: "Cassette 11-42T",
            detail: "Steel sprockets, alloy carrier",
            kind: "part",
            qty: 1,
            unitCost: 46.9,
            leadTimeDays: 54,
            supply: "Long lead",
            supplier: "Calder Drivetrain",
          },
        ],
      },
    ],
  },
  {
    id: "sys-200",
    partNumber: "SYS-200",
    name: "Energy Pack",
    detail: "36 V dual-module pack, smart charging",
    kind: "system",
    qty: 1,
    unitCost: null,
    leadTimeDays: null,
    supply: null,
    supplier: null,
    children: [
      {
        id: "asm-210",
        partNumber: "ASM-210",
        name: "Battery Module",
        detail: "10S4P block, laser welded",
        kind: "assembly",
        qty: 2,
        unitCost: null,
        leadTimeDays: null,
        supply: null,
        supplier: null,
        children: [
          {
            id: "prt-211",
            partNumber: "PRT-211",
            name: "Cell 21700",
            detail: "5.0 Ah, matched by internal resistance",
            kind: "part",
            qty: 40,
            unitCost: 2.35,
            leadTimeDays: 56,
            supply: "Long lead",
            supplier: "Talvane Cells",
          },
          {
            id: "prt-212",
            partNumber: "PRT-212",
            name: "Cell Holder Frame",
            detail: "Flame-retardant PC, V-0 rated",
            kind: "part",
            qty: 4,
            unitCost: 1.95,
            leadTimeDays: 22,
            supply: "Stocked",
            supplier: "Ridgeway Polymers",
          },
          {
            id: "prt-213",
            partNumber: "PRT-213",
            name: "Nickel Busbar",
            detail: "0.2 mm pure nickel strip",
            kind: "part",
            qty: 8,
            unitCost: 0.62,
            leadTimeDays: 16,
            supply: "Stocked",
            supplier: "Halden Wire Works",
          },
        ],
      },
      {
        id: "prt-220",
        partNumber: "PRT-220",
        name: "BMS Controller",
        detail: "20S balancing, CAN diagnostics",
        kind: "part",
        qty: 1,
        unitCost: 58.4,
        leadTimeDays: 49,
        supply: "Single source",
        supplier: "Verrin Electronics",
      },
      {
        id: "prt-230",
        partNumber: "PRT-230",
        name: "Pack Enclosure",
        detail: "IP67 shell with lock barrel",
        kind: "part",
        qty: 1,
        unitCost: 44.2,
        leadTimeDays: 25,
        supply: "Stocked",
        supplier: "Ridgeway Polymers",
      },
      {
        id: "prt-240",
        partNumber: "PRT-240",
        name: "Charge Port",
        detail: "5 A barrel inlet, sealed cap",
        kind: "part",
        qty: 1,
        unitCost: 9.85,
        leadTimeDays: 19,
        supply: "Stocked",
        supplier: "Verrin Electronics",
      },
    ],
  },
  {
    id: "sys-300",
    partNumber: "SYS-300",
    name: "Frame Set",
    detail: "Long-tail cargo frame, 180 kg rating",
    kind: "system",
    qty: 1,
    unitCost: null,
    leadTimeDays: null,
    supply: null,
    supplier: null,
    children: [
      {
        id: "asm-310",
        partNumber: "ASM-310",
        name: "Welded Frame",
        detail: "TIG welded, heat treated after jig",
        kind: "assembly",
        qty: 1,
        unitCost: null,
        leadTimeDays: null,
        supply: null,
        supplier: null,
        children: [
          {
            id: "prt-311",
            partNumber: "PRT-311",
            name: "Main Triangle",
            detail: "Hydroformed 6061 tubeset",
            kind: "part",
            qty: 1,
            unitCost: 96.5,
            leadTimeDays: 42,
            supply: "Single source",
            supplier: "Arbor Frameworks",
          },
          {
            id: "prt-312",
            partNumber: "PRT-312",
            name: "Rear Triangle",
            detail: "Extended chainstay, rack mounts",
            kind: "part",
            qty: 1,
            unitCost: 61.2,
            leadTimeDays: 42,
            supply: "Stocked",
            supplier: "Arbor Frameworks",
          },
          {
            id: "prt-313",
            partNumber: "PRT-313",
            name: "Head Tube Insert",
            detail: "Pressed bearing cup, 1.5 in",
            kind: "part",
            qty: 2,
            unitCost: 7.4,
            leadTimeDays: 20,
            supply: "Stocked",
            supplier: "Norwood Precision",
          },
        ],
      },
      {
        id: "prt-320",
        partNumber: "PRT-320",
        name: "Cargo Deck",
        detail: "Bamboo ply with alloy edging",
        kind: "part",
        qty: 1,
        unitCost: 38.9,
        leadTimeDays: 26,
        supply: "Stocked",
        supplier: "Arbor Frameworks",
      },
      {
        id: "prt-330",
        partNumber: "PRT-330",
        name: "Dual-Leg Kickstand",
        detail: "Centre mount, 200 kg static load",
        kind: "part",
        qty: 1,
        unitCost: 22.4,
        leadTimeDays: 33,
        supply: "Shortage",
        supplier: "Calder Drivetrain",
      },
    ],
  },
  {
    id: "sys-400",
    partNumber: "SYS-400",
    name: "Cockpit",
    detail: "Rider controls and display",
    kind: "system",
    qty: 1,
    unitCost: null,
    leadTimeDays: null,
    supply: null,
    supplier: null,
    children: [
      {
        id: "prt-410",
        partNumber: "PRT-410",
        name: "Display Head Unit",
        detail: "2.4 in transflective LCD, backlit",
        kind: "part",
        qty: 1,
        unitCost: 52.6,
        leadTimeDays: 38,
        supply: "Single source",
        supplier: "Verrin Electronics",
      },
      {
        id: "prt-420",
        partNumber: "PRT-420",
        name: "Brake Lever",
        detail: "Hydraulic, with motor cutoff",
        kind: "part",
        qty: 2,
        unitCost: 14.2,
        leadTimeDays: 27,
        supply: "Stocked",
        supplier: "Calder Drivetrain",
      },
      {
        id: "prt-430",
        partNumber: "PRT-430",
        name: "Handlebar",
        detail: "680 mm alloy riser, 31.8 mm clamp",
        kind: "part",
        qty: 1,
        unitCost: 16.8,
        leadTimeDays: 21,
        supply: "Stocked",
        supplier: "Arbor Frameworks",
      },
      {
        id: "prt-440",
        partNumber: "PRT-440",
        name: "Grip",
        detail: "Locking ergonomic grip",
        kind: "part",
        qty: 2,
        unitCost: 3.6,
        leadTimeDays: 14,
        supply: "Stocked",
        supplier: "Ridgeway Polymers",
      },
    ],
  },
  {
    id: "sys-500",
    partNumber: "SYS-500",
    name: "Rolling Gear",
    detail: "Wheels, tyres and hydraulic braking",
    kind: "system",
    qty: 1,
    unitCost: null,
    leadTimeDays: null,
    supply: null,
    supplier: null,
    children: [
      {
        id: "asm-510",
        partNumber: "ASM-510",
        name: "Wheel Set",
        detail: "Hand-tensioned, 36 spoke build",
        kind: "assembly",
        qty: 2,
        unitCost: null,
        leadTimeDays: null,
        supply: null,
        supplier: null,
        children: [
          {
            id: "prt-511",
            partNumber: "PRT-511",
            name: "Rim",
            detail: "20 in double wall, eyeleted",
            kind: "part",
            qty: 1,
            unitCost: 27.3,
            leadTimeDays: 29,
            supply: "Stocked",
            supplier: "Arbor Frameworks",
          },
          {
            id: "prt-512",
            partNumber: "PRT-512",
            name: "Spoke",
            detail: "14G stainless, butted",
            kind: "part",
            qty: 36,
            unitCost: 0.28,
            leadTimeDays: 17,
            supply: "Stocked",
            supplier: "Halden Wire Works",
          },
          {
            id: "prt-513",
            partNumber: "PRT-513",
            name: "Hub Shell",
            detail: "Sealed cartridge, 15 mm axle",
            kind: "part",
            qty: 1,
            unitCost: 19.6,
            leadTimeDays: 31,
            supply: "Stocked",
            supplier: "Norwood Precision",
          },
          {
            id: "prt-514",
            partNumber: "PRT-514",
            name: "Tyre",
            detail: "20 x 2.4 in, puncture belt",
            kind: "part",
            qty: 1,
            unitCost: 23.9,
            leadTimeDays: 51,
            supply: "Long lead",
            supplier: "Talvane Rubber",
          },
        ],
      },
      {
        id: "asm-520",
        partNumber: "ASM-520",
        name: "Brake Set",
        detail: "Four-piston hydraulic, front and rear",
        kind: "assembly",
        qty: 1,
        unitCost: null,
        leadTimeDays: null,
        supply: null,
        supplier: null,
        children: [
          {
            id: "prt-521",
            partNumber: "PRT-521",
            name: "Hydraulic Caliper",
            detail: "Four piston, mineral oil",
            kind: "part",
            qty: 2,
            unitCost: 31.5,
            leadTimeDays: 36,
            supply: "Stocked",
            supplier: "Calder Drivetrain",
          },
          {
            id: "prt-522",
            partNumber: "PRT-522",
            name: "Brake Rotor",
            detail: "180 mm, six bolt",
            kind: "part",
            qty: 2,
            unitCost: 11.2,
            leadTimeDays: 23,
            supply: "Stocked",
            supplier: "Norwood Precision",
          },
        ],
      },
    ],
  },
];

/** Text a search query is matched against, lowercased once per node. */
export function bomSearchBlob(node: BomNode) {
  return [node.partNumber, node.name, node.detail, node.supplier]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/**
 * Prunes the tree to nodes that match, keeping every ancestor of a hit so the
 * path from the product down to the part stays readable. A named assembly hit
 * keeps its whole subtree, but only when no supply filter is narrowing the
 * parts underneath it.
 */
export function filterBomNodes(
  nodes: BomNode[],
  { query, supply }: { query: string; supply: SupplyStatus[] },
): BomNode[] {
  if (query.length === 0 && supply.length === 0) return nodes;

  const kept: BomNode[] = [];

  for (const node of nodes) {
    if (node.children?.length) {
      if (supply.length === 0 && query.length > 0 && bomSearchBlob(node).includes(query)) {
        kept.push(node);
        continue;
      }

      const children = filterBomNodes(node.children, { query, supply });
      if (children.length > 0) kept.push({ ...node, children });
      continue;
    }

    if (supply.length > 0 && (!node.supply || !supply.includes(node.supply))) {
      continue;
    }

    if (query.length > 0 && !bomSearchBlob(node).includes(query)) continue;

    kept.push(node);
  }

  return kept;
}

/**
 * Resolves every tree-derived measure in one pass. Quantities multiply down the
 * tree, so a part inside an assembly used twice is counted twice; cost and part
 * count sum upward, lead time takes the longest path, and supply takes the
 * worst descendant.
 */
export function buildBomRows(nodes: BomNode[], parentQty = 1): BomRow[] {
  return nodes.map((node) => {
    const effectiveQty = node.qty * parentQty;

    if (!node.children?.length) {
      return {
        id: node.id,
        node,
        effectiveQty,
        extendedCost: (node.unitCost ?? 0) * effectiveQty,
        leadTimeDays: node.leadTimeDays ?? 0,
        supply: node.supply ?? "Stocked",
        partCount: 1,
      };
    }

    const children = buildBomRows(node.children, effectiveQty);

    return {
      id: node.id,
      node,
      effectiveQty,
      extendedCost: children.reduce((sum, row) => sum + row.extendedCost, 0),
      leadTimeDays: children.reduce((longest, row) => Math.max(longest, row.leadTimeDays), 0),
      supply: children.reduce<SupplyStatus>(
        (worst, row) => (SUPPLY_SEVERITY[row.supply] > SUPPLY_SEVERITY[worst] ? row.supply : worst),
        "Stocked",
      ),
      partCount: children.reduce((sum, row) => sum + row.partCount, 0),
      children,
    };
  });
}

/**
 * Opens the first branch at every level and nothing else, so the deepest path
 * through the product is on screen at first paint without the whole tree being
 * dumped on the reader. Follows the first node that actually has children, so a
 * system whose first entry is a purchased part still opens something.
 */
export function getFirstPathExpandedState(rows: BomRow[]) {
  const expanded: Record<string, boolean> = {};
  let current: BomRow[] | undefined = rows;

  while (current?.length) {
    const branch: BomRow | undefined = current.find((row) => row.children?.length);
    if (!branch) break;
    expanded[branch.id] = true;
    current = branch.children;
  }

  return expanded;
}

/** Ids of every expandable row down to `level`, for the depth control. */
export function getLevelExpandedState(rows: BomRow[], level: number) {
  const expanded: Record<string, boolean> = {};

  function walk(current: BomRow[], depth: number) {
    if (depth >= level) return;

    for (const row of current) {
      if (!row.children?.length) continue;
      expanded[row.id] = true;
      walk(row.children, depth + 1);
    }
  }

  walk(rows, 0);
  return expanded;
}

/** Stable fingerprint of an expanded-row map, used to light the depth control. */
export function expandedSignature(expanded: Record<string, boolean>) {
  return Object.keys(expanded)
    .filter((id) => expanded[id])
    .sort()
    .join("|");
}

export function totalCost(rows: BomRow[]) {
  return rows.reduce((sum, row) => sum + row.extendedCost, 0);
}

export function totalParts(rows: BomRow[]) {
  return rows.reduce((sum, row) => sum + row.partCount, 0);
}

export function criticalPath(rows: BomRow[]) {
  return rows.reduce((longest, row) => Math.max(longest, row.leadTimeDays), 0);
}

/** Purchased parts under these rows whose supply status needs attention. */
export function countAtRisk(rows: BomRow[]): number {
  return rows.reduce((count, row) => {
    if (row.children?.length) return count + countAtRisk(row.children);
    // Reads the resolved row, not the raw node, so a part with no supply value
    // counts as stocked here exactly as it renders in the grid.
    return count + (row.supply === "Stocked" ? 0 : 1);
  }, 0);
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number) {
  return CURRENCY_FORMATTER.format(value);
}

export function formatQuantity(value: number) {
  return value.toLocaleString("en-US");
}

export function formatShare(value: number, total: number) {
  if (total <= 0) return "0%";
  const share = (value / total) * 100;
  return share >= 10 ? `${Math.round(share)}%` : `${share.toFixed(1)}%`;
}
