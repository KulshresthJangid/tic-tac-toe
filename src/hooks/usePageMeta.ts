import { useEffect } from 'react';

interface OgOptions {
  title: string;
  description: string;
  image?: string;
  type?: string;
}

interface PageMetaOptions {
  /** Self-referential canonical URL for this page. */
  canonical?: string;
  /** JSON-LD structured data object(s) to inject for this page only. Removed on unmount. */
  jsonLd?: object | object[];
  /**
   * Per-page Open Graph + Twitter Card overrides. Opt-in — pages that don't
   * pass this keep whatever og: and twitter: tags index.html (or a previous
   * page) already set, same as canonical's existing behaviour. Unlike
   * canonical, these aren't removed on unmount (og: tags are expected to
   * always be present once the document has loaded) — they're restored to
   * the site-wide homepage defaults instead.
   */
  og?: OgOptions;
}

const SITE_DEFAULT = {
  url: 'https://buildwithkulshresth.com/',
  title: 'Kulshresth Jangid — Backend Engineer · Node.js, TypeScript, Java · Open to Remote',
  description:
    'Backend engineer with 4+ years shipping distributed systems, SaaS APIs, and real-time applications. Available for remote roles and consulting.',
  image: 'https://buildwithkulshresth.com/og-image.png',
};

function setMetaByProperty(property: string, content: string): void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setMetaByName(name: string, content: string): void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
}

/**
 * Sets document.title, meta[name="description"], canonical link, per-page
 * Open Graph/Twitter Card tags, and per-page JSON-LD structured data on
 * mount. JSON-LD is cleaned up on unmount/route change; OG/Twitter tags are
 * restored to the site-wide defaults.
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

    if (options?.og) {
      const og = options.og;
      const url = options.canonical ?? SITE_DEFAULT.url;
      const image = og.image ?? SITE_DEFAULT.image;
      setMetaByProperty('og:type', og.type ?? 'website');
      setMetaByProperty('og:url', url);
      setMetaByProperty('og:title', og.title);
      setMetaByProperty('og:description', og.description);
      setMetaByProperty('og:image', image);
      setMetaByName('twitter:title', og.title);
      setMetaByName('twitter:description', og.description);
      setMetaByName('twitter:image', image);
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
      if (link) link.href = SITE_DEFAULT.url;

      if (options?.og) {
        setMetaByProperty('og:type', 'website');
        setMetaByProperty('og:url', SITE_DEFAULT.url);
        setMetaByProperty('og:title', SITE_DEFAULT.title);
        setMetaByProperty('og:description', SITE_DEFAULT.description);
        setMetaByProperty('og:image', SITE_DEFAULT.image);
        setMetaByName('twitter:title', SITE_DEFAULT.title);
        setMetaByName('twitter:description', SITE_DEFAULT.description);
        setMetaByName('twitter:image', SITE_DEFAULT.image);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, options?.canonical, options?.og]);
}
