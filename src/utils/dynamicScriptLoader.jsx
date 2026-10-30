/**
 * Dynamic Script Loader Utility
 * 
 * Loads external scripts only when needed to optimize performance
 * Prevents global script loading that blocks page rendering
 */

/**
 * Load an external script dynamically
 * @param {string} src - Script source URL
 * @param {string} id - Unique ID for the script element
 * @returns {Promise} - Resolves when script is loaded
 */
export const loadScript = (src, id) => {
    return new Promise((resolve, reject) => {
        // Check if script already exists
        if (document.getElementById(id)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.async = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        
        document.body.appendChild(script);
    });
};

/**
 * Load jQuery dynamically (only where absolutely needed)
 * @returns {Promise}
 */
export const loadJQuery = () => {
    return loadScript('https://code.jquery.com/jquery-3.6.0.min.js', 'jquery-script');
};

/**
 * Load Owl Carousel dynamically (only on pages that use it)
 * @returns {Promise}
 */
export const loadOwlCarousel = async () => {
    try {
        // Load CSS first
        if (!document.getElementById('owl-carousel-css')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css';
            link.id = 'owl-carousel-css';
            document.head.appendChild(link);
        }

        // Load JS
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.2.1/owl.carousel.js', 'owl-carousel-script');
    } catch (error) {
        console.error('Failed to load Owl Carousel:', error);
        throw error;
    }
};

/**
 * Load Razorpay checkout script (only during payment)
 * @returns {Promise}
 */
export const loadRazorpay = () => {
    return loadScript('https://checkout.razorpay.com/v1/checkout.js', 'razorpay-script');
};

/**
 * Remove a dynamically loaded script
 * @param {string} id - Script element ID
 */
export const removeScript = (id) => {
    const script = document.getElementById(id);
    if (script) {
        script.remove();
    }
};
