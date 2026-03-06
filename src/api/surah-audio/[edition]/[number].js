// api/surah-audio/[edition]/[number].js
export default async function handler(req, res) {
  const {
    query: { edition, number },
    method,
  } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const url = `https://cdn.islamic.network/quran/audio-surah/64/${edition}/${number}.mp3`;
    const response = await fetch(url);

    if (!response.ok || !response.body) {
      return res.status(502).json({ error: "Failed to fetch audio" });
    }

    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://quran-seven-jet.vercel.app",
    );
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

    const contentType = response.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);

    response.body.pipe(res);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy error" });
  }
}
