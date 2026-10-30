import React, { lazy, Suspense } from 'react';

export default function loadable(importer, { loading: Loading = () => null } = {}) {
  const Component = lazy(() => importer().then(module => ({ default: module.default || module })));
  return function LazyComponent(props) {
    return <Suspense fallback={<Loading />}><Component {...props} /></Suspense>;
  };
}
