"use client";
import { useEffect, useRef, useState } from "react";

export default function ClientStream({ slug }: { slug: string }) {
  const [html, setHtml] = useState("<div>Generating…</div>");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      const res = await fetch(`/api/stream?slug=${encodeURIComponent(slug)}`, {
        method: "GET",
        signal: controller.signal,
      });
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setHtml(`<div>${acc}</div>`);
      }
      setHtml(`<div>${acc}</div>`);
    })();

    return () => controller.abort();
  }, [slug]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}


