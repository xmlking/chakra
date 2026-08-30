import { log } from "evlog";
// import { env } from "virtual:env/server";
import { sleep } from "workflow";

export async function processOrder(id: string) {
  "use workflow";

  const reserved = await reserveInventory(id);
  await sleep("1 hour");
  return chargeOrder(reserved);
}

async function reserveInventory(id: string) {
  "use step";
  log.debug("workflow", "reserveInventory");
  return { id, reservationId: `reservation-${id}` };
}

async function chargeOrder(order: { id: string; reservationId: string }) {
  "use step";
  log.debug("workflow", "chargeOrder");
  // log.debug("workflow", "chargeOrder" + env.ONRAMP_SCHEDULER_CRON);
  return { ...order, status: "charged" as const };
}
