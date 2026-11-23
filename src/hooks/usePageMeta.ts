import { useEffect } from 'react';
import { breadcrumbLd, type Crumb } from '../lib/seo';

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
   * Per-page Open Graph + Twitter Card overrides. Opt-in, pages that don't
   * pass this keep whatever og: and twitter: tags index.html (or a previous
   * page) already set, same as canonical's existing behaviour. Unlike
   * canonical, these aren't removed on unmount (og: tags are expected to
   * always be present once the document has loaded), they're restored to
   * the site-wide homepage defaults instead.
   */
  og?: OgOptions;
  /**
   * Mark the page noindex (used by the 404 page). Also drops the canonical,
   * since a noindex page has no canonical URL worth declaring.
   */
  noindex?: boolean;
  /** Adds a BreadcrumbList to the page's JSON-LD. First crumb should be Home. */
  breadcrumbs?: Crumb[];
}

const ROBOTS_DEFAULT = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

/** Canonical for the current location when a page does not pass one: no trailing slash, no query/hash. */
function currentCanonical(): string {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path === '/' ? 'https://buildwithkulshresth.com/' : `https://buildwithkulshresth.com${path}`;
}

const SITE_DEFAULT = {
  url: 'https://buildwithkulshresth.com/',
  title: 'Kulshresth Jangid: Backend Engineer · Node.js, TypeScript, Java · Open to Remote',
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

    const canonical = options?.noindex ? undefined : (options?.canonical ?? currentCanonical());
    if (options?.noindex) {
      setMetaByName('robots', 'noindex, follow');
      document.querySelector('link[rel="canonical"]')?.remove();
    } else if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    if (options?.og) {
      const og = options.og;
      const url = canonical ?? SITE_DEFAULT.url;
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
    const schemaList: object[] = [
      ...(options?.jsonLd ? (Array.isArray(options.jsonLd) ? options.jsonLd : [options.jsonLd]) : []),
      ...(options?.breadcrumbs ? [breadcrumbLd(options.breadcrumbs)] : []),
    ];
    if (schemaList.length > 0) {
      // Remove any stale page-level schema from a previous route
      document.getElementById('page-jsonld')?.remove();
      scriptEl = document.createElement('script');
      scriptEl.type = 'application/ld+json';
      scriptEl.id = 'page-jsonld';
      scriptEl.textContent = JSON.stringify(schemaList.length === 1 ? schemaList[0] : schemaList);
      document.head.appendChild(scriptEl);
    }

    return () => {
      document.getElementById('page-jsonld')?.remove();
      if (options?.noindex) setMetaByName('robots', ROBOTS_DEFAULT);
      // Restore global canonical on unmount
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = SITE_DEFAULT.url;

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
  }, [title, description, options?.canonical, options?.og, options?.noindex, options?.breadcrumbs]);
}
