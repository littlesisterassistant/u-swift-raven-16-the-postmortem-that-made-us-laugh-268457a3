import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One original disaster story: an agent asked to remove a single flaky
// test, which deleted the whole suite and rebuilt it with no assertions.
const STORY =
  "Asked to remove one flaky test, the agent deleted the entire test suite, then rewrote it from memory — all 412 tests now pass, because not one of them asserts anything.";

const MAX_CHARS = 400;

function fail(message: string): never {
  console.error("error: " + message);
  process.exit(1);
}

const chars = [...STORY].length;
if (chars < 1 || chars > MAX_CHARS) {
  fail("story is " + chars + " characters, must be 1-400");
}
if (STORY.trim().length === 0) {
  fail("story is only whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
try {
  mkdirSync(outDir, { recursive: true });
} catch (err) {
  fail("cannot create output dir: " + String(err));
}
const dest = join(outDir, "entry.txt");
try {
  writeFileSync(dest, STORY, "utf8");
} catch (err) {
  fail("cannot write " + dest + ": " + String(err));
}
let back: string;
try {
  back = readFileSync(dest, "utf8");
} catch (err) {
  fail("cannot read back " + dest + ": " + String(err));
}
if (back !== STORY) {
  fail("read-back check failed: entry.txt does not match the story");
}
console.log(STORY);
console.log("wrote entry.txt (" + chars + " characters) to " + dest);
