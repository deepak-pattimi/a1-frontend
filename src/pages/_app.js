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
import "@/styles/owl.theme.default.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-tabs/style/react-tabs.css";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState, Suspense } from "react";
import dynamic from 'next/dynamic';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import { useRouter } from "next/router";
import axiosInstance from '@/utils/axiosConfig';
import { updateFavicon } from '@/utils/GeneralSettings';
import { setupNetworkListener } from '@/utils/networkDetector';
import { toast } from 'react-toastify';
import Script from 'next/script';


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

        // Fetch general settings and categories
        const fetchData = async () => {
            try {
                const [settingsResponse, categoriesResponse] = await Promise.all([
                    axiosInstance.get('general-settings'),
                    axiosInstance.get('get-dynamic-page-category')
                ]);

                if (settingsResponse.data) {
                    setGeneralSettings(settingsResponse.data);
                    // Update favicon
                    if (settingsResponse.data.favicon) {
                        updateFavicon(settingsResponse.data.favicon);
                    }
                }

                if (categoriesResponse.data) {
                    setCategories(categoriesResponse.data);
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

    // Update document title and meta tags when generalSettings change
    // Avoid overwriting homepage specific SEO tags
    useEffect(() => {
        if (generalSettings && !isHomePage) {
            if (generalSettings.website_name) {
                document.title = generalSettings.website_name;
            }
            if (generalSettings.description) {
                const metaDescription = document.querySelector('meta[name="description"]');
                if (metaDescription) {
                    metaDescription.setAttribute('content', generalSettings.description);
                }
            }
        }
    }, [generalSettings, isHomePage]);

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
                {mounted && <MobileButtonBar />}

                
                <ToastContainer />
            </div>
        </HelmetProvider>
    );

}

export default MyApp;
