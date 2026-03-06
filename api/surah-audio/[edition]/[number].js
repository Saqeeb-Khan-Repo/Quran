// api/surah-audio/[edition]/[number].js
export default async function handler(req, res) {
  console.log("Function hit", req.query);

  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://quran-seven-jet.vercel.app",
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { edition, number } = req.query;
    const url = `https://cdn.islamic.network/quran/audio-surah/64/${edition}/${number}.mp3`;
    const upstream = await fetch(url);

    if (!upstream.ok) {
      return res
        .status(502)
        .json({
          error: "Failed to fetch audio from CDN",
          status: upstream.status,
        });
    }

    const arrayBuffer = await upstream.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const contentType = upstream.headers.get("content-type") || "audio/mpeg";
    res.setHeader("Content-Type", contentType);

    res.status(200).end(uint8);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy error" });
  }
}
