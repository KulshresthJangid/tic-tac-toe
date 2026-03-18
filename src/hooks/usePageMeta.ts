import { useEffect } from 'react';

/**
 * Sets document.title and optionally the meta[name="description"] on mount.
 * Crawler-visible for JS-rendered pages; also improves browser tab UX.
 */
export function usePageMeta(title: string, description?: string): void {
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
  }, [title, description]);
}
