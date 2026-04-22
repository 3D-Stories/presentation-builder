//
// build.js — Auth Migration All-Hands Talk
// Main orchestrator: creates presentation, loads all sections, asserts slide count, writes file.
//
// Cut plan: not required (duration under 20 min)
// Expected slide count: 17
//   S0: 1  (title/hook)
//   S1: 3  (legacy pain)
//   S2: 5  (what we built: divider + 4 content)
//   S3: 4  (incident: divider + 3 content)
//   S4: 3  (lessons: divider + 2 content)
//   S5: 1  (closing)
//   Total: 17
//
// Usage: NODE_PATH=/home/rocky00717/.npm-global/lib/node_modules node build.js
//

"use strict";

const path = require("path");
const pptx = require("pptxgenjs");

const addSection0 = require("./slides-s0");
const addSection1 = require("./slides-s1");
const addSection2 = require("./slides-s2");
const addSection3 = require("./slides-s3");
const addSection4 = require("./slides-s4");
const addSection5 = require("./slides-s5");

const EXPECTED_SLIDE_COUNT = 17;
const OUTPUT_PATH = path.resolve(__dirname, "../output.pptx");

async function main() {
  const pres = new pptx();

  // Metadata
  pres.author  = "Platform Team";
  pres.company = "Engineering";
  pres.subject = "Auth v2 Migration — All-Hands Talk";
  pres.title   = "Auth v2: What We Shipped, What Broke, and What We'd Do Differently";

  // Slide layout: widescreen 10x7.5 inches
  pres.defineLayout({ name: "LAYOUT_WIDE", width: 10, height: 7.5 });
  pres.layout = "LAYOUT_WIDE";

  // Load sections — each wrapped in try-catch so failures identify the section
  try {
    addSection0(pres);
    console.log("  ✓ Section 0: Title & Hook");
  } catch (e) {
    console.error("  ✗ Section 0 FAILED:", e.message);
    process.exit(1);
  }

  try {
    addSection1(pres);
    console.log("  ✓ Section 1: Why We Had to Change");
  } catch (e) {
    console.error("  ✗ Section 1 FAILED:", e.message);
    process.exit(1);
  }

  try {
    addSection2(pres);
    console.log("  ✓ Section 2: What We Built");
  } catch (e) {
    console.error("  ✗ Section 2 FAILED:", e.message);
    process.exit(1);
  }

  try {
    addSection3(pres);
    console.log("  ✓ Section 3: The Incident");
  } catch (e) {
    console.error("  ✗ Section 3 FAILED:", e.message);
    process.exit(1);
  }

  try {
    addSection4(pres);
    console.log("  ✓ Section 4: What We'd Do Differently");
  } catch (e) {
    console.error("  ✗ Section 4 FAILED:", e.message);
    process.exit(1);
  }

  try {
    addSection5(pres);
    console.log("  ✓ Section 5: Closing");
  } catch (e) {
    console.error("  ✗ Section 5 FAILED:", e.message);
    process.exit(1);
  }

  // Assert slide count
  const actual = pres.slides.length;
  if (actual !== EXPECTED_SLIDE_COUNT) {
    console.error(`  ✗ Slide count assertion FAILED: expected ${EXPECTED_SLIDE_COUNT}, got ${actual}`);
    process.exit(1);
  }
  console.log(`  ✓ Slide count: ${actual}/${EXPECTED_SLIDE_COUNT}`);

  // Write output
  console.log(`\nWriting to: ${OUTPUT_PATH}`);
  await pres.writeFile({ fileName: OUTPUT_PATH });
  console.log("  ✓ Done.");
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
