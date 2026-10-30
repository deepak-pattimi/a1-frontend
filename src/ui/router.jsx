import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export function useRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  return useMemo(() => ({
    pathname: location.pathname.replace(/\/$/, '') || '/',
    asPath: location.pathname + location.search,
    query: { ...Object.fromEntries(new URLSearchParams(location.search)), ...params },
    isReady: true,
    push: to => navigate(to),
    replace: to => navigate(to, { replace: true }),
    back: () => navigate(-1),
  }), [location, navigate, params]);
}
