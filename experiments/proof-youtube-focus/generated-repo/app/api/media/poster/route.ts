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
<text x="112" y="155" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="54" font-weight="700">StudyStream</text>
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
  if (id.endsWith("002")) return { background: "#3f3a1d", panel: "#6f642f", accent: "#f2c14e", line: "#fff3bf" };
  if (id.endsWith("003")) return { background: "#19324d", panel: "#315c8a", accent: "#7dd3fc", line: "#dbeafe" };
  if (id.endsWith("004")) return { background: "#3f1f2b", panel: "#7a314f", accent: "#f97316", line: "#ffe4e6" };
  return { background: "#0f3b35", panel: "#146c5f", accent: "#f6ad55", line: "#d1fae5" };
}

function posterTitle(id: string): string {
  if (id.endsWith("002")) return "データ可視化復習";
  if (id.endsWith("003")) return "TypeScript strict";
  if (id.endsWith("004")) return "支払い失敗UI";
  return "集中キュー設計";
}

function encodeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
