import { sleep } from "workflow";

export async function mySimpleWorkflow(name: string) {
  "use workflow";

  console.log(`Starting workflow for ${name}`);

  // Simulated delay
  await sleep("1s");

  console.log(`Workflow for ${name} resumed and finished!`);

  return {
    status: "completed",
    name,
  };
}
