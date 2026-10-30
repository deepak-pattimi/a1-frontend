/**
 * AI Detection & LLM Optimization Utilities
 * Provides meta tags and structured data for better AI search engine visibility
 */

/**
 * Generate AI-specific meta tags for a page
 * @param {Object} options - Configuration options
 * @returns {Array} Array of meta tag objects
 */
export const getAIMetaTags = (options = {}) => {
    const {
        author = 'Dr. Naveen Kumar Anem',
        publisher = 'A1 Laparoscopy Hospital',
        category = 'Healthcare, Medical Services',
        contentType = 'medical-facility',
        purpose = 'informational, medical-consultation'
    } = options;

    return [
        // Standard AI crawler directives
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        
        // Attribution meta tags
        { name: 'author', content: author },
        { name: 'publisher', content: publisher },
        { name: 'copyright', content: publisher },
        
        // Content classification
        { name: 'category', content: category },
        { name: 'rating', content: 'general' },
        { name: 'distribution', content: 'global' },
        
        // AI-specific metadata
        { name: 'ai-purpose', content: purpose },
        { name: 'ai-content-type', content: contentType }
    ];
};

/**
 * Generate AI-focused structured data (JSON-LD)
 * Enhances understanding for LLMs and AI search engines
 * @param {Object} pageData - Page specific data
 * @returns {Object} JSON-LD structured data object
 */
export const getAIStructuredData = (pageData = {}) => {
    const {
        title,
        description,
        url,
        type = 'WebPage',
        keywords = [],
        lastModified
    } = pageData;

    return {
        '@context': 'https://schema.org',
        '@type': type,
        headline: title,
        description: description,
        url: url,
        keywords: keywords.join(', '),
        dateModified: lastModified || new Date().toISOString(),
        // AI-specific properties
        inLanguage: 'en-US',
        isAccessibleForFree: true,
        accessibilitySummary: 'Medical information website with professional healthcare content'
    };
};

/**
 * Common AI content categories for medical websites
 */
export const AI_CONTENT_CATEGORIES = {
    HOMEPAGE: 'Healthcare, Medical Services, Laparoscopic Surgery',
    DOCTOR_PROFILE: 'Medical Professional, Surgeon Profile, Healthcare Provider',
    SERVICE_PAGE: 'Medical Procedure, Surgical Service, Healthcare Treatment',
    BLOG_POST: 'Medical Education, Health Information, Patient Care Guide',
    GALLERY: 'Medical Facility, Surgical Equipment, Healthcare Infrastructure',
    REVIEWS: 'Patient Testimonials, Healthcare Reviews, Medical Service Feedback',
    CONTACT: 'Healthcare Contact, Medical Appointment, Hospital Location'
};

/**
 * Common AI content types
 */
export const AI_CONTENT_TYPES = {
    MEDICAL_FACILITY: 'medical-facility',
    SURGICAL_SERVICE: 'surgical-service',
    PATIENT_CARE: 'patient-care',
    MEDICAL_EDUCATION: 'medical-education',
    HEALTH_INFORMATION: 'health-information',
    PROFESSIONAL_PROFILE: 'professional-profile'
};

/**
 * Generate complete head configuration for AI optimization
 * @param {Object} config - Complete page configuration
 * @returns {Object} Head configuration object
 */
export const getAIHeadConfig = (config = {}) => {
    const {
        title,
        description,
        url,
        canonical,
        image,
        author,
        category,
        contentType,
        keywords = []
    } = config;

    return {
        // Basic SEO
        title,
        meta: [
            ...getAIMetaTags({
                author,
                category: category || AI_CONTENT_CATEGORIES.HOMEPAGE,
                contentType: contentType || AI_CONTENT_TYPES.MEDICAL_FACILITY
            }),
            { name: 'description', content: description },
            { name: 'keywords', content: keywords.join(', ') },
            
            // Open Graph
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:url', content: url || canonical },
            { property: 'og:type', content: 'website' },
            image && { property: 'og:image', content: image },
            
            // Twitter Card
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            image && { name: 'twitter:image', content: image },
            
            // Canonical
            canonical && { rel: 'canonical', href: canonical }
        ].filter(Boolean),
        
        // Structured Data
        script: [{
            type: 'application/ld+json',
            innerHTML: JSON.stringify(getAIStructuredData({
                title,
                description,
                url: url || canonical,
                keywords
            }))
        }]
    };
};

export default {
    getAIMetaTags,
    getAIStructuredData,
    getAIHeadConfig,
    AI_CONTENT_CATEGORIES,
    AI_CONTENT_TYPES
};
