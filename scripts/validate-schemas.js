/**
 * SEO Schema Validation Script
 * 
 * This script helps validate that all pages have proper JSON-LD schema markup
 * Run with: node scripts/validate-schemas.js
 */

const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../src/pages');
const SCHEMAS_DIR = path.join(__dirname, '../src/utils/schemas');

// Expected pages and their schema types
const expectedSchemas = [
  { file: 'index.js', schema: 'Homepage (Hospital + WebSite + FAQPage)' },
  { file: 'Aboutdr.js', schema: 'Physician (Dr. Naveen Kumar Anem)' },
  { file: 'dr-prathyusha-gynecologist.js', schema: 'Physician (Dr. I.S. Prathyusha)' },
  { file: 'bariatric-surgery-visakhapatnam.js', schema: 'MedicalProcedure (Bariatric Surgery)' },
  { file: 'hernia-repair-visakhapatnam.js', schema: 'MedicalProcedure (Hernia Repair)' },
  { file: 'laparoscopic-surgery-visakhapatnam.js', schema: 'MedicalProcedure (Laparoscopic Surgery)' },
  { file: 'gallstone-surgery-visakhapatnam.js', schema: 'MedicalProcedure (Gallstone Surgery)' },
  { file: 'appendectomy-visakhapatnam.js', schema: 'MedicalProcedure (Appendectomy)' },
  { file: 'hysterectomy-visakhapatnam.js', schema: 'MedicalProcedure (Hysterectomy)' },
  { file: 'hysteroscopy-visakhapatnam.js', schema: 'MedicalProcedure (Hysteroscopy)' },
  { file: 'piles-fistula-treatment-visakhapatnam.js', schema: 'MedicalProcedure (Piles & Fistula)' },
];

console.log('🔍 SEO Schema Validation Report\n');
console.log('=' .repeat(60));

// Check if schema utility files exist
console.log('\n📁 Schema Utility Files:');
const schemaFiles = ['hospital.js', 'doctors.js', 'services.js', 'blog.js', 'index.js'];
schemaFiles.forEach(file => {
  const filePath = path.join(SCHEMAS_DIR, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Check if expected page files exist and contain schema
console.log('\n📄 Page Files with Schema:');
expectedSchemas.forEach(({ file, schema }) => {
  const filePath = path.join(PAGES_DIR, file);
  const exists = fs.existsSync(filePath);
  
  if (!exists) {
    console.log(`  ❌ ${file} - File not found`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const hasSchemaImport = content.includes("from '@/utils/schemas'");
  const hasScriptTag = content.includes('type="application/ld+json"');
  const hasDangerouslySetInnerHTML = content.includes('dangerouslySetInnerHTML');
  
  const status = hasSchemaImport && hasScriptTag && hasDangerouslySetInnerHTML ? '✅' : '⚠️';
  console.log(`  ${status} ${file}`);
  console.log(`     Schema: ${schema}`);
  
  if (!hasSchemaImport) {
    console.log(`     ⚠️  Missing schema import`);
  }
  if (!hasScriptTag) {
    console.log(`     ⚠️  Missing script tag`);
  }
});

// Check for [FILL IN] placeholders
console.log('\n⚠️  Checking for Unfilled Placeholders:');
let placeholdersFound = false;

expectedSchemas.forEach(({ file }) => {
  const filePath = path.join(PAGES_DIR, file);
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('[FILL IN')) {
    console.log(`  ⚠️  ${file} - Contains unfilled placeholders`);
    placeholdersFound = true;
  }
});

if (!placeholdersFound) {
  console.log('  ✅ No unfilled placeholders found in page files');
} else {
  console.log('\n  ⚠️  ACTION REQUIRED: Replace all [FILL IN] placeholders before deployment!');
}

// Check schema utility files for placeholders
console.log('\n📋 Schema Utility Files - Placeholder Check:');
schemaFiles.forEach(file => {
  const filePath = path.join(SCHEMAS_DIR, file);
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(/\[FILL IN[^\]]*\]/g);
  
  if (matches && matches.length > 0) {
    console.log(`  ⚠️  ${file} - ${matches.length} placeholder(s) found:`);
    matches.forEach(match => {
      console.log(`     - ${match}`);
    });
  } else {
    console.log(`  ✅ ${file} - No placeholders`);
  }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 Summary:');
console.log(`  Total expected pages: ${expectedSchemas.length}`);
console.log(`  Schema files created: ${schemaFiles.length}`);

const missingFiles = expectedSchemas.filter(({ file }) => 
  !fs.existsSync(path.join(PAGES_DIR, file))
).length;

console.log(`  Missing page files: ${missingFiles}`);
console.log(`  Placeholders to fill: ${placeholdersFound ? 'YES - Action Required!' : 'None'}`);

console.log('\n✅ Next Steps:');
console.log('  1. Replace all [FILL IN] placeholders with actual values');
console.log('  2. Validate at https://validator.schema.org');
console.log('  3. Test at https://search.google.com/test/rich-results');
console.log('  4. Verify in production: curl -s URL | grep "application/ld+json"');
console.log('\n📖 Full documentation: SEO_SCHEMA_CONFIG.md\n');
