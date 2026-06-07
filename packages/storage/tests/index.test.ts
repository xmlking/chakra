import { createFiles } from "files-sdk";
import { memory } from "files-sdk/memory";
import { usage } from "files-sdk/usage";
import { expect, test, describe } from "vite-plus/test";

const bytes = (data: string): Uint8Array => new TextEncoder().encode(data);

const metered = () =>
  createFiles({
    adapter: memory(),
    plugins: [usage()],
  });

describe("usage", () => {
  test("counts an operation and the bytes uploaded", async () => {
    const files = metered();
    await files.upload("a.txt", bytes("hello"));

    const stats = files.usage();
    expect(stats.operations).toBe(1);
    expect(stats.operationsByKind.upload).toBe(1);
    expect(stats.bytesUp).toBe(5);
    expect(stats.bytesDown).toBe(0);
  });

  test("meters download bytes read via text()", async () => {
    const files = metered();
    await files.upload("a.txt", bytes("hello"));
    const file = await files.download("a.txt");
    expect(await file.text()).toBe("hello");

    const stats = files.usage();
    expect(stats.operations).toBe(2);
    expect(stats.operationsByKind.download).toBe(1);
    expect(stats.bytesDown).toBe(5);
  });
});
