"use client";
import { useEffect, useState } from "react";

export default function ClientStream({ slug }: { slug: string }) {
  const [html, setHtml] = useState("<div>Generating…</div>");

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`/api/stream?slug=${encodeURIComponent(slug)}`, {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          setHtml(`<div>Failed to generate. ${text ? `\n${text}` : ""}</div>`);
          return;
        }
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
        // flush final chunk
        acc += decoder.decode();
        setHtml(`<div>${acc}</div>`);
      } catch (err: unknown) {
        if (err && typeof err === "object" && (err as any).name === "AbortError") {
          return; // ignore aborts (e.g., effect cleanup or route change)
        }
        setHtml(`<div>Stream error.</div>`);
      }
    })();

    return () => controller.abort();
  }, [slug]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}


