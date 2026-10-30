import { useEffect } from 'react';

export default function Script({ id, src, dangerouslySetInnerHTML }) {
  const content = dangerouslySetInnerHTML?.__html;
  useEffect(() => {
    if (id && document.getElementById(id)) return;
    const script = document.createElement('script');
    if (id) script.id = id;
    if (src) { script.src = src; script.async = true; }
    if (content) script.textContent = content;
    document.head.appendChild(script);
  }, [id, src, content]);
  return null;
}
