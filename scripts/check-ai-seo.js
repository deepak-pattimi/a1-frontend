#!/usr/bin/env node

/**
 * AI Detection & SEO Validation Script
 * Tests website for AI crawler accessibility and LLM optimization
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const BASE_URL = 'https://www.a1laparoscopyhospital.com';

console.log(`${colors.cyan}╔══════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║   AI Detection & SEO Validation Tool        ║${colors.reset}`);
console.log(`${colors.cyan}║   A1 Laparoscopy Hospital                   ║${colors.reset}`);
console.log(`${colors.cyan}╚══════════════════════════════════════════════╝${colors.reset}\n`);

// Test results storage
const results = {
    passed: [],
    warnings: [],
    errors: []
};

/**
 * Check if robots.txt exists and is properly configured
 */
function checkRobotsTxt() {
    console.log(`${colors.blue}[1/8] Checking robots.txt...${colors.reset}`);
    
    const robotsPath = path.join(__dirname, '../public/robots.txt');
    
    if (!fs.existsSync(robotsPath)) {
        results.errors.push('❌ robots.txt file not found');
        return;
    }
    
    const content = fs.readFileSync(robotsPath, 'utf8');
    
    // Check for AI crawlers
    const aiCrawlers = ['GPTBot', 'ChatGPT-User', 'CCBot', 'Google-Extended', 'anthropic-ai'];
    const foundCrawlers = aiCrawlers.filter(crawler => content.includes(crawler));
    
    if (foundCrawlers.length > 0) {
        results.passed.push(`✅ AI crawlers configured: ${foundCrawlers.join(', ')}`);
    } else {
        results.warnings.push('⚠️  No specific AI crawler rules found in robots.txt');
    }
    
    // Check for sitemap reference
    if (content.includes('Sitemap:')) {
        results.passed.push('✅ Sitemap referenced in robots.txt');
    } else {
        results.errors.push('❌ Sitemap not referenced in robots.txt');
    }
    
    console.log(`   Found ${foundCrawlers.length} AI crawler rules\n`);
}

/**
 * Check meta tags on homepage
 */
async function checkMetaTags() {
    console.log(`${colors.blue}[2/8] Checking meta tags...${colors.reset}`);
    
    try {
        const response = await fetchUrl(BASE_URL);
        
        // Check for AI-specific meta tags
        const aiMetaTags = [
            { name: 'ai-purpose', found: response.includes('ai-purpose') },
            { name: 'ai-content-type', found: response.includes('ai-content-type') },
            { name: 'author', found: response.includes('name="author"') },
            { name: 'publisher', found: response.includes('name="publisher"') }
        ];
        
        const foundTags = aiMetaTags.filter(tag => tag.found);
        
        if (foundTags.length >= 3) {
            results.passed.push(`✅ AI meta tags present: ${foundTags.map(t => t.name).join(', ')}`);
        } else {
            results.warnings.push(`⚠️  Limited AI meta tags found (${foundTags.length}/4)`);
        }
        
        // Check standard SEO tags
        const standardTags = [
            { name: 'description', found: response.includes('name="description"') },
            { name: 'canonical', found: response.includes('rel="canonical"') },
            { name: 'og:title', found: response.includes('property="og:title"') },
            { name: 'twitter:card', found: response.includes('twitter:card') }
        ];
        
        const foundStandard = standardTags.filter(tag => tag.found);
        results.passed.push(`✅ Standard SEO tags: ${foundStandard.length}/${standardTags.length} present`);
        
        console.log(`   Found ${foundTags.length} AI meta tags, ${foundStandard.length} standard tags\n`);
    } catch (error) {
        results.errors.push(`❌ Error checking meta tags: ${error.message}`);
    }
}

/**
 * Check structured data (JSON-LD)
 */
async function checkStructuredData() {
    console.log(`${colors.blue}[3/8] Checking structured data...${colors.reset}`);
    
    try {
        const response = await fetchUrl(BASE_URL);
        
        // Extract JSON-LD scripts
        const jsonLdMatches = response.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
        
        if (jsonLdMatches && jsonLdMatches.length > 0) {
            results.passed.push(`✅ Found ${jsonLdMatches.length} JSON-LD structured data blocks`);
            
            // Check for key schema types
            const hasHospital = response.includes('"@type":"Hospital"') || response.includes('"@type": "Hospital"');
            const hasPhysician = response.includes('"@type":"Physician"') || response.includes('"@type": "Physician"');
            const hasMedicalProcedure = response.includes('"@type":"MedicalProcedure"') || response.includes('"@type": "MedicalProcedure"');
            
            if (hasHospital) results.passed.push('✅ Hospital schema detected');
            if (hasPhysician) results.passed.push('✅ Physician schema detected');
            if (hasMedicalProcedure) results.passed.push('✅ MedicalProcedure schema detected');
        } else {
            results.errors.push('❌ No JSON-LD structured data found');
        }
        
        console.log(`   Found ${jsonLdMatches ? jsonLdMatches.length : 0} structured data blocks\n`);
    } catch (error) {
        results.errors.push(`❌ Error checking structured data: ${error.message}`);
    }
}

/**
 * Check sitemap.xml
 */
function checkSitemap() {
    console.log(`${colors.blue}[4/8] Checking sitemap.xml...${colors.reset}`);
    
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    
    if (!fs.existsSync(sitemapPath)) {
        results.errors.push('❌ sitemap.xml file not found');
        return;
    }
    
    const content = fs.readFileSync(sitemapPath, 'utf8');
    
    // Count URLs
    const urlMatches = content.match(/<url>/g);
    const urlCount = urlMatches ? urlMatches.length : 0;
    
    if (urlCount > 0) {
        results.passed.push(`✅ Sitemap contains ${urlCount} URLs`);
    } else {
        results.errors.push('❌ Sitemap is empty or malformed');
    }
    
    // Check for lastmod dates
    const hasLastMod = content.includes('<lastmod>');
    if (hasLastMod) {
        results.passed.push('✅ Last modified dates included in sitemap');
    }
    
    console.log(`   Found ${urlCount} URLs in sitemap\n`);
}

/**
 * Check page load performance
 */
async function checkPerformance() {
    console.log(`${colors.blue}[5/8] Checking page performance...${colors.reset}`);
    
    try {
        const startTime = Date.now();
        await fetchUrl(BASE_URL);
        const loadTime = Date.now() - startTime;
        
        if (loadTime < 2000) {
            results.passed.push(`✅ Fast page load: ${loadTime}ms`);
        } else if (loadTime < 4000) {
            results.warnings.push(`⚠️  Moderate page load: ${loadTime}ms`);
        } else {
            results.errors.push(`❌ Slow page load: ${loadTime}ms`);
        }
        
        console.log(`   Page loaded in ${loadTime}ms\n`);
    } catch (error) {
        results.errors.push(`❌ Performance check failed: ${error.message}`);
    }
}

/**
 * Check mobile responsiveness headers
 */
async function checkMobileResponsiveness() {
    console.log(`${colors.blue}[6/8] Checking mobile responsiveness...${colors.reset}`);
    
    try {
        const response = await fetchUrl(BASE_URL);
        
        const hasViewport = response.includes('viewport');
        const hasResponsiveMeta = response.includes('width=device-width');
        
        if (hasViewport && hasResponsiveMeta) {
            results.passed.push('✅ Mobile viewport meta tag configured');
        } else {
            results.errors.push('❌ Missing mobile viewport configuration');
        }
        
        console.log(`   Viewport: ${hasViewport ? '✅' : '❌'}, Responsive: ${hasResponsiveMeta ? '✅' : '❌'}\n`);
    } catch (error) {
        results.errors.push(`❌ Mobile check failed: ${error.message}`);
    }
}

/**
 * Check HTTPS and security headers
 */
async function checkSecurity() {
    console.log(`${colors.blue}[7/8] Checking security headers...${colors.reset}`);
    
    try {
        const response = await fetchUrl(BASE_URL);
        
        // Check if URL uses HTTPS
        if (BASE_URL.startsWith('https://')) {
            results.passed.push('✅ Using HTTPS protocol');
        } else {
            results.errors.push('❌ Not using HTTPS');
        }
        
        console.log(`   Protocol: ${BASE_URL.startsWith('https://') ? 'HTTPS ✅' : 'HTTP ❌'}\n`);
    } catch (error) {
        results.errors.push(`❌ Security check failed: ${error.message}`);
    }
}

/**
 * Check content accessibility
 */
async function checkAccessibility() {
    console.log(`${colors.blue}[8/8] Checking content accessibility...${colors.reset}`);
    
    try {
        const response = await fetchUrl(BASE_URL);
        
        // Check for H1 tag
        const hasH1 = /<h1[^>]*>.*?<\/h1>/i.test(response);
        if (hasH1) {
            results.passed.push('✅ H1 heading tag present');
        } else {
            results.errors.push('❌ Missing H1 heading tag');
        }
        
        // Check for alt attributes on images
        const imagesWithoutAlt = (response.match(/<img[^>]*(?!alt=)[^>]*>/gi) || []).length;
        if (imagesWithoutAlt === 0) {
            results.passed.push('✅ All images have alt attributes');
        } else {
            results.warnings.push(`⚠️  ${imagesWithoutAlt} images missing alt attributes`);
        }
        
        console.log(`   H1: ${hasH1 ? '✅' : '❌'}, Images without alt: ${imagesWithoutAlt}\n`);
    } catch (error) {
        results.errors.push(`❌ Accessibility check failed: ${error.message}`);
    }
}

/**
 * Fetch URL content
 */
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

/**
 * Print summary report
 */
function printSummary() {
    console.log(`${colors.cyan}╔══════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║              VALIDATION SUMMARY             ║${colors.reset}`);
    console.log(`${colors.cyan}╚══════════════════════════════════════════════╝${colors.reset}\n`);
    
    console.log(`${colors.green}✅ PASSED (${results.passed.length}):${colors.reset}`);
    results.passed.forEach(item => console.log(`   ${item}`));
    console.log();
    
    if (results.warnings.length > 0) {
        console.log(`${colors.yellow}⚠️  WARNINGS (${results.warnings.length}):${colors.reset}`);
        results.warnings.forEach(item => console.log(`   ${item}`));
        console.log();
    }
    
    if (results.errors.length > 0) {
        console.log(`${colors.red}❌ ERRORS (${results.errors.length}):${colors.reset}`);
        results.errors.forEach(item => console.log(`   ${item}`));
        console.log();
    }
    
    // Overall score
    const total = results.passed.length + results.warnings.length + results.errors.length;
    const score = Math.round((results.passed.length / total) * 100);
    
    console.log(`${colors.cyan}Overall Score: ${score}%${colors.reset}`);
    
    if (score >= 90) {
        console.log(`${colors.green}🎉 Excellent! Your site is well-optimized for AI and SEO${colors.reset}`);
    } else if (score >= 70) {
        console.log(`${colors.yellow}👍 Good! Some improvements recommended${colors.reset}`);
    } else {
        console.log(`${colors.red}⚠️  Needs improvement. Address the errors above${colors.reset}`);
    }
    
    console.log();
}

/**
 * Main execution
 */
async function main() {
    console.log('Starting AI Detection & SEO Validation...\n');
    
    // Run all checks
    checkRobotsTxt();
    await checkMetaTags();
    await checkStructuredData();
    checkSitemap();
    await checkPerformance();
    await checkMobileResponsiveness();
    await checkSecurity();
    await checkAccessibility();
    
    // Print results
    printSummary();
    
    // Exit with appropriate code
    process.exit(results.errors.length > 0 ? 1 : 0);
}

main().catch(error => {
    console.error(`${colors.red}Fatal error:${colors.reset}`, error);
    process.exit(1);
});
