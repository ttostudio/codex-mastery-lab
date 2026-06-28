export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("v") ?? "vf-001";
  const palette = posterPalette(id);
  const title = encodeXml(posterTitle(id));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" role="img" aria-label="${title}">
<rect width="1280" height="720" fill="${palette.background}"/>
<rect x="64" y="64" width="1152" height="592" rx="28" fill="${palette.panel}" opacity=".92"/>
<circle cx="1048" cy="198" r="112" fill="${palette.accent}" opacity=".8"/>
<path d="M154 510 C284 392 378 552 506 438 S732 333 872 466 1090 423 1166 326" fill="none" stroke="${palette.line}" stroke-width="26" stroke-linecap="round"/>
<text x="112" y="155" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="54" font-weight="700">WatchFlow</text>
<text x="112" y="230" fill="#dbeafe" font-family="system-ui, sans-serif" font-size="34">${title}</text>
</svg>`;
  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=3600"
    }
  });
}

function posterPalette(id: string): { background: string; panel: string; accent: string; line: string } {
  if (id.endsWith("002")) return { background: "#3c2f2f", panel: "#6f4e37", accent: "#d9a441", line: "#f7e7ce" };
  if (id.endsWith("003")) return { background: "#163024", panel: "#254d3c", accent: "#5fb49c", line: "#c9f2df" };
  if (id.endsWith("004")) return { background: "#1f2937", panel: "#374151", accent: "#ef4444", line: "#bfdbfe" };
  return { background: "#102a43", panel: "#176b87", accent: "#f59e0b", line: "#e0f2fe" };
}

function posterTitle(id: string): string {
  if (id.endsWith("002")) return "週末の作業机";
  if (id.endsWith("003")) return "TypeScript strict";
  if (id.endsWith("004")) return "Premium workflow";
  return "動画サービス設計";
}

function encodeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
