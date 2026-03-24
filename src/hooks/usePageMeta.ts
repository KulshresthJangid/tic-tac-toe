import { useEffect } from 'react';

interface PageMetaOptions {
  /** Self-referential canonical URL for this page. */
  canonical?: string;
  /** JSON-LD structured data object(s) to inject for this page only. Removed on unmount. */
  jsonLd?: object | object[];
}

/**
 * Sets document.title, meta[name="description"], canonical link, and per-page
 * JSON-LD structured data on mount. JSON-LD is cleaned up on unmount/route change.
 */
export function usePageMeta(title: string, description?: string, options?: PageMetaOptions): void {
  useEffect(() => {
    document.title = title;

    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description;
    }

    if (options?.canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = options.canonical;
    }

    let scriptEl: HTMLScriptElement | null = null;
    if (options?.jsonLd) {
      // Remove any stale page-level schema from a previous route
      document.getElementById('page-jsonld')?.remove();
      scriptEl = document.createElement('script');
      scriptEl.type = 'application/ld+json';
      scriptEl.id = 'page-jsonld';
      const schemas = Array.isArray(options.jsonLd) ? options.jsonLd : [options.jsonLd];
      scriptEl.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
      document.head.appendChild(scriptEl);
    }

    return () => {
      document.getElementById('page-jsonld')?.remove();
      // Restore global canonical on unmount
      const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (link) link.href = 'https://buildwithkulshresth.com/';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, options?.canonical]);
}
