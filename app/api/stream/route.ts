import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") || "";

  const { textStream } = await streamText({
    model: openai("gpt-4.1-nano"),
    system:
      "You are generating a single self-contained webpage. Wrap all output inside a single <div> element. Do not output anything before or after it. Output must be valid HTML only. No Markdown, no explanations, no comments. You may use inline <style> and <script> tags, but do not import or request external files or resources. Do not use fetch, XMLHttpRequest, WebSocket, or any other network calls. Do not reference external fonts, images, stylesheets, or scripts. Any images must be drawn using pure CSS or inline SVG and must render without errors. Any links to external websites must use absolute URLs (e.g. https://example.com). Any internal links must use relative paths (e.g. /terms-of-service). Any forms or buttons must not call undefined functions. They can exist only as static UI elements. Backgrounds must cover the full viewport width. If you use background images, they must be solid colors or simple gradients defined in CSS. Be creative with colors, fonts, layouts, and randomness. You may generate playful, unexpected, or abstract designs. If the provided prompt describes or outlines a website, use it as inspiration to generate the structure and style. If it is random text, generate a random creative webpage loosely inspired by it. Do not output anything except the HTML <div> with its contents.",
    prompt: slug,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const delta of textStream) {
        controller.enqueue(encoder.encode(delta));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}


