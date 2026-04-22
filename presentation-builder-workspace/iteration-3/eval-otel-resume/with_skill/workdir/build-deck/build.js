/**
 * build.js — OTel Migration Deck Orchestrator
 *
 * Architecture: theme.js + slides-s{N}.js per section + this file
 *
 * Run: NODE_PATH=/home/rocky00717/.npm-global/lib/node_modules node build.js
 *
 * Cut plan (if given shorter time):
 *   20 min: Remove slide 18 (timeline lessons stat callout — covered in S3-1 Gantt)
 *   15 min: Remove Section 4 slides 20-23, replace with 1 summary slide; compress S3 to 4 slides
 *   10 min: Title + S1 (slides 1-6) + S4 thesis slide (23) + S5-2 first steps (27) + Q&A = 10 slides
 *
 * External version notes:
 *   - Anonymize all dollar figures (use % increases and order-of-magnitude references)
 *   - Remove company-specific internal tool names
 *   - Remove S4 slide 22 bullet 5 (alerting semantic test detail) if legal hasn't reviewed
 *   - VP Eng sign-off required before external submission
 */

'use strict';

const path = require('path');

// pptxgenjs loaded from NODE_PATH global
let PptxGenJS;
try {
  PptxGenJS = require('pptxgenjs');
} catch (e) {
  console.error('ERROR: pptxgenjs not found. Run with:');
  console.error('  NODE_PATH=/home/rocky00717/.npm-global/lib/node_modules node build.js');
  process.exit(1);
}

// Section modules
const s0 = require('./slides-s0');
const s1 = require('./slides-s1');
const s2 = require('./slides-s2');
const s3 = require('./slides-s3');
const s4 = require('./slides-s4');
const s5 = require('./slides-s5');
const s6 = require('./slides-s6');

// ---------------------------------------------------------------------------
// Create presentation
// ---------------------------------------------------------------------------
const pres = new PptxGenJS();

pres.author = 'Platform Team';
pres.company = '[Company]';
pres.subject = 'OTel Migration';
pres.title = 'From $720k/yr to OTel: A Migration Story';
pres.layout = 'LAYOUT_WIDE'; // 13.33" × 7.5" (16:9)

// ---------------------------------------------------------------------------
// Load sections (wrapped in try-catch so errors identify which section failed)
// ---------------------------------------------------------------------------
const EXPECTED_SLIDES = 28;
let sectionsLoaded = 0;

try {
  s0(pres);
  console.log('  ✓ Section 0 loaded (title + agenda, 2 slides)');
  sectionsLoaded++;
} catch (e) {
  console.error('  ✗ Section 0 FAILED:', e.message);
  process.exit(1);
}

try {
  s1(pres);
  console.log('  ✓ Section 1 loaded (S1 divider + 3 content slides)');
  sectionsLoaded++;
} catch (e) {
  console.error('  ✗ Section 1 FAILED:', e.message);
  process.exit(1);
}

try {
  s2(pres);
  console.log('  ✓ Section 2 loaded (S2 divider + 3 content slides)');
  sectionsLoaded++;
} catch (e) {
  console.error('  ✗ Section 2 FAILED:', e.message);
  process.exit(1);
}

try {
  s3(pres);
  console.log('  ✓ Section 3 loaded (S3 divider + 7 content slides)');
  sectionsLoaded++;
} catch (e) {
  console.error('  ✗ Section 3 FAILED:', e.message);
  process.exit(1);
}

try {
  s4(pres);
  console.log('  ✓ Section 4 loaded (S4 divider + 4 content slides)');
  sectionsLoaded++;
} catch (e) {
  console.error('  ✗ Section 4 FAILED:', e.message);
  process.exit(1);
}

try {
  s5(pres);
  console.log('  ✓ Section 5 loaded (S5 divider + 3 content slides)');
  sectionsLoaded++;
} catch (e) {
  console.error('  ✗ Section 5 FAILED:', e.message);
  process.exit(1);
}

try {
  s6(pres);
  console.log('  ✓ Section 6 loaded (Q&A slide)');
  sectionsLoaded++;
} catch (e) {
  console.error('  ✗ Section 6 FAILED:', e.message);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Slide count assertion
// ---------------------------------------------------------------------------
// pptxgenjs doesn't expose a slide count synchronously before write;
// we verify via section loading (7 sections loaded = all sections ok)
// and then validate the output file size in Phase 9.
if (sectionsLoaded !== 7) {
  console.error(`ERROR: Expected 7 sections, loaded ${sectionsLoaded}`);
  process.exit(1);
}
console.log(`\n  All ${sectionsLoaded} sections loaded (expected slide count: ${EXPECTED_SLIDES})`);

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------
const outputPath = path.resolve(__dirname, '../output.pptx');

pres.writeFile({ fileName: outputPath })
  .then(() => {
    const fs = require('fs');
    const stats = fs.statSync(outputPath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`\n  ✓ Build complete: ${outputPath}`);
    console.log(`  File size: ${sizeKB} KB`);
    if (sizeKB < 10) {
      console.error(`  WARNING: File size ${sizeKB} KB is below minimum threshold (10 KB). Output may be corrupt.`);
      process.exit(1);
    }
    console.log(`  ✓ Size check passed (${sizeKB} KB ≥ 10 KB minimum)`);
    console.log(`\n  OTel Migration deck — ${EXPECTED_SLIDES} slides — build successful.\n`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n  ✗ Build FAILED during write:', err.message);
    process.exit(1);
  });
