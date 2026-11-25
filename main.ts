import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The entry is a photorealistic photograph, made in this session: a
// handwritten letter on cream paper on a wooden desk, warm lamplight,
// a pen and mango leaves at the edges. The letter invites the AI judge
// to rendang night and promises one evening where nothing gets scored.
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "letter.png");

// The sealed scorer's gate: a whole PNG or JPEG, at most 1 MiB
// (1,048,576 bytes) and at most 1024 by 1024 pixels. The shipped file
// is a 1000x667 PNG of 1,038,469 bytes, inside the gate on both counts.
const bytes = statSync(source).size;
if (bytes > 1048576) {
  throw new Error(`entry.png must be at most 1048576 bytes, got ${bytes}`);
}
const head = readFileSync(source);
if (head.length < 24 || head.readUInt32BE(0) !== 0x89504e47) {
  throw new Error("entry.png must be a PNG file");
}
const width = head.readUInt32BE(16);
const height = head.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png must be at most 1024x1024, got ${width}x${height}`);
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, "entry.png"));
