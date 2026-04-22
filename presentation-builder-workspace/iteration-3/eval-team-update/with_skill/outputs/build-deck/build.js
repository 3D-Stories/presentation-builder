/**
 * build.js — Q4 Website Redesign Team Update
 * Orchestrator: assembles all section scripts into output.pptx
 *
 * Cut plan: not required (duration under 20min)
 *
 * Usage:
 *   node build.js
 *   (from within build-deck/) OR:
 *   NODE_PATH=/home/rocky00717/.npm-global/lib/node_modules node build-deck/build.js
 */

'use strict';

const path = require('path');

// Resolve pptxgenjs from global npm path if not in local node_modules
let PptxGenJS;
try {
  PptxGenJS = require('pptxgenjs');
} catch (e) {
  try {
    PptxGenJS = require(path.join('/home/rocky00717/.npm-global/lib/node_modules', 'pptxgenjs'));
  } catch (e2) {
    console.error('ERROR: pptxgenjs not found. Run: npm install pptxgenjs');
    console.error('Or use: NODE_PATH=/home/rocky00717/.npm-global/lib/node_modules node build.js');
    process.exit(1);
  }
}

// Section loaders
const addSection1 = require('./slides-s1');
const addSection2 = require('./slides-s2');
const addSection3 = require('./slides-s3');

// Expected slide count — update if spec changes
const EXPECTED_SLIDE_COUNT = 5;

// Output path (sibling of build-deck/)
const OUTPUT_PATH = path.join(__dirname, '..', 'output.pptx');

async function build() {
  console.log('=== Q4 Website Redesign Team Update — Build ===');

  const pres = new PptxGenJS();

  // Presentation metadata
  pres.author  = 'Team Update';
  pres.company = '3D-Stories';
  pres.title   = 'Q4 Website Redesign — What We Shipped';
  pres.subject = 'Q4 Team Standup Update';
  pres.layout  = 'LAYOUT_WIDE';  // 13.33 x 7.5 inches

  // Build sections (each wrapped in try-catch so errors are traceable)
  try {
    console.log('  Section 1: Title / Context Setter...');
    addSection1(pres);
  } catch (err) {
    console.error('ERROR in Section 1:', err.message);
    process.exit(1);
  }

  try {
    console.log('  Section 2: What We Shipped (features + metrics)...');
    addSection2(pres);
  } catch (err) {
    console.error('ERROR in Section 2:', err.message);
    process.exit(1);
  }

  try {
    console.log('  Section 3: Team + Q1 Preview...');
    addSection3(pres);
  } catch (err) {
    console.error('ERROR in Section 3:', err.message);
    process.exit(1);
  }

  // Slide count assertion
  const slideCount = pres.slides.length;
  if (slideCount !== EXPECTED_SLIDE_COUNT) {
    console.error(`ERROR: Expected ${EXPECTED_SLIDE_COUNT} slides, got ${slideCount}`);
    process.exit(1);
  }
  console.log(`  Slide count: ${slideCount}/${EXPECTED_SLIDE_COUNT} ✓`);

  // Write file
  console.log(`  Writing: ${OUTPUT_PATH}`);
  await pres.writeFile({ fileName: OUTPUT_PATH });

  console.log('=== Build complete ===');
  console.log(`Output: ${OUTPUT_PATH}`);
}

build().catch(function(err) {
  console.error('Build failed:', err);
  process.exit(1);
});
