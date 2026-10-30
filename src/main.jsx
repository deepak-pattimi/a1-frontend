import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import MyApp from './pages/_app';

const modules = import.meta.glob(['./pages/**/*.jsx', '!./pages/_*.jsx']);
const pages = Object.entries(modules).filter(([file]) => !file.includes('/_') && !file.includes('/api/'));
const Loading = () => <main className="container py-5" role="status">Loading page…</main>;
const NotFound = () => <main className="container py-5"><h1>Page not found</h1><a href="/">Return home</a></main>;

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return <main className="container py-5"><h1>Unable to display this page</h1><button onClick={() => window.location.reload()}>Reload</button></main>;
    return this.props.children;
  }
}

function Page({ importer }) {
  const params = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);
  useEffect(() => {
    let active = true;
    setResult(null);
    window.scrollTo(0, 0);
    importer().then(async module => {
      const data = module.loadPageData ? await module.loadPageData({ params, query: Object.fromEntries(new URLSearchParams(location.search)) }) : { props: {} };
      if (active) setResult({ Component: data.notFound ? NotFound : module.default, props: data.props || {} });
    }).catch(error => {
      console.error('Page load failed:', error);
      if (active) setResult({ Component: () => <main className="container py-5"><h1>Unable to load page</h1><p>Check that the backend and MySQL are running.</p><button onClick={() => window.location.reload()}>Retry</button></main>, props: {} });
    });
    return () => { active = false; };
  }, [importer, location.pathname, location.search]);
  return <MyApp Component={result?.Component || Loading} pageProps={result?.props || {}} />;
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter><ErrorBoundary><Routes>
    {pages.map(([file, importer]) => {
      const route = file.replace('./pages', '').replace(/\.jsx$/, '').replace(/\/index$/, '/').replace(/\[(\w+)\]/g, ':$1');
      return <Route key={file} path={route} element={<Page importer={importer} />} />;
    })}
    <Route path="/blog" element={<Navigate to="/blogs" replace />} />
    <Route path="/Aboutdr" element={<Navigate to="/about-doctor" replace />} />
    <Route path="/Aboutclinic" element={<Navigate to="/about-clinic" replace />} />
    <Route path="*" element={<MyApp Component={NotFound} pageProps={{}} />} />
  </Routes></ErrorBoundary></BrowserRouter>
);
