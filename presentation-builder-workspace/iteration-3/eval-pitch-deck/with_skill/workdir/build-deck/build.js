// build.js — FitLoop Pitch Deck Orchestrator
// Run: NODE_PATH=/home/rocky00717/.npm-global/lib/node_modules node build-deck/build.js
//
// Cut plan: not required (duration under 20min)
//
// Expected slide count: 12
// Sections:
//   S1: Slides 1-2   (Hook)
//   S2: Slides 3-4   (Problem)
//   S3: Slide  5     (Why Now)
//   S4: Slides 6-7   (Product)
//   S5: Slide  8     (Traction)
//   S6: Slides 9-11  (Business Model + Ask)
//   S7: Slide  12    (Close)

'use strict';

const path = require('path');

// Resolve pptxgenjs from global node_modules if not found locally
let PptxGenJS;
try {
  PptxGenJS = require('pptxgenjs');
} catch (e) {
  const globalPath = process.env.NODE_PATH || '/home/rocky00717/.npm-global/lib/node_modules';
  try {
    PptxGenJS = require(path.join(globalPath, 'pptxgenjs'));
  } catch (e2) {
    console.error('ERROR: pptxgenjs not found. Run with NODE_PATH=/home/rocky00717/.npm-global/lib/node_modules');
    process.exit(1);
  }
}

const EXPECTED_SLIDE_COUNT = 12;

// ─── Load Section Builders ────────────────────────────────────────────────────
const buildSection1 = require('./slides-s1');
const buildSection2 = require('./slides-s2');
const buildSection3 = require('./slides-s3');
const buildSection4 = require('./slides-s4');
const buildSection5 = require('./slides-s5');
const buildSection6 = require('./slides-s6');
const buildSection7 = require('./slides-s7');

// ─── Build ────────────────────────────────────────────────────────────────────
async function build() {
  console.log('FitLoop Pitch Deck — Build Starting');
  console.log(`Expected slide count: ${EXPECTED_SLIDE_COUNT}`);

  const pres = new PptxGenJS();

  // Metadata
  pres.author  = 'FitLoop';
  pres.company = 'FitLoop';
  pres.title   = 'FitLoop — Seed Round Pitch Deck';
  pres.subject = 'FitLoop $2M Seed Round — Consumer Fitness App';
  pres.layout  = 'LAYOUT_16x9';

  // ─── Add Slides by Section ────────────────────────────────────────────────
  try {
    buildSection1(pres);
    console.log('  ✓ Section 1: Hook (Slides 1-2)');
  } catch (e) {
    console.error('  ✗ Section 1 FAILED:', e.message);
    process.exit(1);
  }

  try {
    buildSection2(pres);
    console.log('  ✓ Section 2: Problem (Slides 3-4)');
  } catch (e) {
    console.error('  ✗ Section 2 FAILED:', e.message);
    process.exit(1);
  }

  try {
    buildSection3(pres);
    console.log('  ✓ Section 3: Why Now (Slide 5)');
  } catch (e) {
    console.error('  ✗ Section 3 FAILED:', e.message);
    process.exit(1);
  }

  try {
    buildSection4(pres);
    console.log('  ✓ Section 4: Product (Slides 6-7)');
  } catch (e) {
    console.error('  ✗ Section 4 FAILED:', e.message);
    process.exit(1);
  }

  try {
    buildSection5(pres);
    console.log('  ✓ Section 5: Traction (Slide 8)');
  } catch (e) {
    console.error('  ✗ Section 5 FAILED:', e.message);
    process.exit(1);
  }

  try {
    buildSection6(pres);
    console.log('  ✓ Section 6: Business Model + Ask (Slides 9-11)');
  } catch (e) {
    console.error('  ✗ Section 6 FAILED:', e.message);
    process.exit(1);
  }

  try {
    buildSection7(pres);
    console.log('  ✓ Section 7: Close (Slide 12)');
  } catch (e) {
    console.error('  ✗ Section 7 FAILED:', e.message);
    process.exit(1);
  }

  // ─── Assert Slide Count ───────────────────────────────────────────────────
  const actualSlideCount = pres.slides.length;
  if (actualSlideCount !== EXPECTED_SLIDE_COUNT) {
    console.error(`SLIDE COUNT ASSERTION FAILED: expected ${EXPECTED_SLIDE_COUNT}, got ${actualSlideCount}`);
    process.exit(1);
  }
  console.log(`  ✓ Slide count: ${actualSlideCount}/${EXPECTED_SLIDE_COUNT}`);

  // ─── Write Output ─────────────────────────────────────────────────────────
  const outputPath = path.join(__dirname, '..', 'output.pptx');
  await pres.writeFile({ fileName: outputPath });

  console.log(`\nBuild complete: ${outputPath}`);
  console.log(`Slides: ${actualSlideCount}`);
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
