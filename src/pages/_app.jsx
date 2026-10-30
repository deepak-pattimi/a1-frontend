import "bootstrap/dist/css/bootstrap.min.css";
import "@/Components/Navbar.css";
import "@/styles/globals.css";
import "@/Components/media.css";
import "@/Components/PatientGuide/BlogGrid.css";
import "@/Components/PatientGuide/BlogDetail.css";
import "@/Components/MobileButtonBar.css";
import "@/styles/components.css";

// Library Styles
import "aos/dist/aos.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-tabs/style/react-tabs.css";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/mobile.css";
import React, { useEffect, useState, Suspense } from "react";
import dynamic from '@/ui/loadable';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import { useRouter } from "@/ui/router";
import axiosInstance from '@/utils/axiosConfig';
import { updateFavicon } from '@/utils/GeneralSettings';
import { setupNetworkListener } from '@/utils/networkDetector';
import { toast } from 'react-toastify';
import Script from '@/ui/Script';


// Dynamic imports for global components
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
const MobileButtonBar = dynamic(() => import("@/Components/MobileButtonBar"), { ssr: false });
const GlobalAppointmentPopup = dynamic(() => import("@/Components/GlobalAppointmentPopup"), { ssr: false });



// Create a simple loading component
const LoadingFallback = () => (
    <div className="text-center p-5">
        <div>Loading...</div>
    </div>
);

function MyApp({ Component, pageProps }) {
    const [generalSettings, setGeneralSettings] = useState(pageProps.generalSettings || null);
    const [categories, setCategories] = useState(pageProps.categories || []);
    const [loading, setLoading] = useState(!pageProps.generalSettings);
    const [mounted, setMounted] = useState(false);

    const router = useRouter();
    const isHomePage = router.pathname === "/";

    useEffect(() => {
        setMounted(true);

        // Network listener
        const cleanupNetworkListener = setupNetworkListener(
            () => toast.success('Connection restored', { autoClose: 2000 }),
            () => toast.warning('No internet connection', { autoClose: 3000 })
        );

        // Fetch general settings and categories if not already provided via pageProps
        const fetchData = async () => {
            try {
                // Check sessionStorage for instant zero-lag load on subsequent page views
                let hasCachedCats = false;
                let hasCachedSettings = false;
                if (typeof window !== 'undefined') {
                    try {
                        const cachedCats = sessionStorage.getItem('a1_cats_cache');
                        if (cachedCats && (!categories || categories.length === 0)) {
                            setCategories(JSON.parse(cachedCats));
                            hasCachedCats = true;
                        }
                        const cachedSettings = sessionStorage.getItem('a1_settings_cache');
                        if (cachedSettings && !generalSettings && !pageProps.generalSettings) {
                            const parsed = JSON.parse(cachedSettings);
                            setGeneralSettings(parsed);
                            if (parsed.favicon) updateFavicon(parsed.favicon);
                            hasCachedSettings = true;
                        }
                    } catch (e) {}
                }

                const promises = [];
                let settingsPromise = null;
                let categoriesPromise = null;

                if (!generalSettings && !pageProps.generalSettings && !hasCachedSettings) {
                    settingsPromise = axiosInstance.get('general-settings');
                    promises.push(settingsPromise);
                }

                if ((!categories || categories.length === 0) && (!pageProps.categories || pageProps.categories.length === 0) && !hasCachedCats) {
                    categoriesPromise = axiosInstance.get('get-dynamic-page-category');
                    promises.push(categoriesPromise);
                }

                if (promises.length > 0) {
                    await Promise.all(promises);
                }

                if (settingsPromise) {
                    const settingsRes = await settingsPromise;
                    if (settingsRes?.data) {
                        setGeneralSettings(settingsRes.data);
                        if (settingsRes.data.favicon) {
                            updateFavicon(settingsRes.data.favicon);
                        }
                        try {
                            sessionStorage.setItem('a1_settings_cache', JSON.stringify(settingsRes.data));
                        } catch (e) {}
                    }
                } else if (generalSettings?.favicon || pageProps.generalSettings?.favicon) {
                    updateFavicon(generalSettings?.favicon || pageProps.generalSettings?.favicon);
                }

                if (categoriesPromise) {
                    const categoriesRes = await categoriesPromise;
                    if (categoriesRes?.data && Array.isArray(categoriesRes.data)) {
                        // Strip out any heavyweight content fields to protect client memory
                        const sanitized = categoriesRes.data.map(cat => ({
                            id: cat.id,
                            name: cat.name,
                            slug: cat.slug,
                            order_no: cat.order_no,
                            pages: (cat.pages || []).map(p => ({
                                id: p.id,
                                category_id: p.category_id,
                                page_name: p.page_name,
                                slug: p.slug,
                            }))
                        }));
                        setCategories(sanitized);
                        try {
                            sessionStorage.setItem('a1_cats_cache', JSON.stringify(sanitized));
                        } catch (e) {}
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            cleanupNetworkListener();
        };
    }, []);

    // Page data arrives asynchronously in the browser after the layout mounts.
    useEffect(() => {
        if (pageProps.generalSettings) setGeneralSettings(pageProps.generalSettings);
        if (pageProps.categories) setCategories(pageProps.categories);
    }, [pageProps.generalSettings, pageProps.categories]);

    return (
        <HelmetProvider>
            {/* Google Tag Manager - Optimized Loading */}
            <Script
                id="gtm-script"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-WVMM5MZN');`,
                }}
            />
            <div className="App">

                <Header generalSettings={generalSettings} categories={categories} />
                
                {mounted && isHomePage && <GlobalAppointmentPopup />}
                
                <Component {...pageProps} />
                
                <Footer generalSettings={generalSettings} categories={categories} />

                
                {/* Mobile Button Bar - only shown on mobile devices */}
                {mounted && <MobileButtonBar generalSettings={generalSettings} />}

                
                <ToastContainer />
            </div>
        </HelmetProvider>
    );

}

export default MyApp;
