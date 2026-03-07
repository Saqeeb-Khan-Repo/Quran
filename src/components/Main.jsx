// Main.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [surahs, setSurahs] = useState([]); // [{ meta, arabic, translation }]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSurah, setExpandedSurah] = useState(null);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState("en"); // "en" or "ur"
  const navigate = useNavigate();

  // Map UI lang -> AlQuran.cloud edition id
  const editionForLang = lang === "en" ? "en.asad" : "ur.jalandhary";

  const fetchAllSurahs = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1) get basic list of Surahs (numbers, names)
      const resList = await fetch("https://api.alquran.cloud/v1/surah");
      const listJson = await resList.json();
      const list = listJson.data; // array of surah meta

      const results = [];

      // 2) fetch Arabic + translation for each Surah
      for (const s of list) {
        const res = await fetch(
          `https://api.alquran.cloud/v1/surah/${s.number}/editions/quran-uthmani,${editionForLang}`,
        );
        const json = await res.json();
        // json.data[0] = Arabic, json.data[1] = translation
        results.push({
          meta: s,
          arabic: json.data[0],
          translation: json.data[1],
        });
      }

      setSurahs(results);
    } catch (err) {
      console.error("API error", err);
      setError("Failed to load Quran data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and whenever language changes
  useEffect(() => {
    fetchAllSurahs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editionForLang]);

  const openSurah = (surahNumber) => {
    navigate(`/surah/${surahNumber}?lang=${lang}`);
  };

  const toggleSurah = (number) => {
    setExpandedSurah((prev) => (prev === number ? null : number));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <h1 className="text-3xl md:text-4xl font-semibold">Loading…</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-red-400">
        {error}
      </div>
    );
  }

  // Filter by search
  const filteredSurahs = surahs.filter(({ meta }) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      meta.englishName.toLowerCase().includes(q) ||
      meta.englishNameTranslation.toLowerCase().includes(q) ||
      meta.name.toLowerCase().includes(q) ||
      String(meta.number).includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="max-w-5xl mx-auto px-4 pt-10 pb-6 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
          القرآن الكريم
        </h1>
        <h2 className="text-lg md:text-2xl text-slate-300">Quran Kareem</h2>

        <div className="mt-4 flex flex-col md:flex-row gap-3 items-center justify-center">
          <input
            type="search"
            placeholder="Search by Surah name, Arabic name or number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-slate-600 bg-slate-800/70 text-slate-100 rounded-xl w-full md:w-80 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
          />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border-2 border-slate-600 bg-slate-800/70 text-slate-100 rounded-xl px-3 py-3 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
          >
            <option value="en">English</option>
            <option value="ur">Urdu</option>
          </select>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-10 space-y-4">
        {filteredSurahs.length === 0 && (
          <p className="text-center text-slate-400">
            No Surah matched “{search}”.
          </p>
        )}

        {filteredSurahs.map(({ meta, arabic, translation }) => {
          const isOpen = expandedSurah === meta.number;

          return (
            <div
              key={meta.number}
              className={`transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer
                bg-slate-800/80 border border-slate-700 shadow-md hover:shadow-xl 
                ${isOpen ? "ring-2 ring-emerald-400" : ""}`}
              onClick={() => toggleSurah(meta.number)}
            >
              {/* Header */}
              <div className="flex items-center gap-4 p-4 md:p-5">
                <div className="shrink-0 h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-xl font-bold">
                  {meta.number}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold">
                        {meta.englishName}{" "}
                        <span className="text-emerald-300">({meta.name})</span>
                      </h3>
                      <p className="text-sm md:text-base text-slate-300">
                        {meta.englishNameTranslation}
                      </p>
                    </div>
                    <span className="text-xs md:text-sm px-3 py-1 rounded-full bg-slate-700 text-slate-200">
                      Ayahs: {meta.numberOfAyahs}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded ayahs preview */}
              {isOpen && (
                <div
                  className="border-t border-slate-700 bg-slate-950/60"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-104 overflow-y-auto p-4 md:p-6 space-y-3">
                    {arabic.ayahs.map((a, idx) => {
                      const t = translation.ayahs[idx];
                      return (
                        <button
                          key={a.number}
                          type="button"
                          onClick={() => openSurah(meta.number)}
                          className="w-full text-left rounded-xl bg-slate-800/80 px-4 py-3 hover:bg-slate-700/80 transition-colors"
                        >
                          <div className="flex items-baseline justify-between mb-2">
                            <span className="text-sm text-emerald-300 font-semibold">
                              Ayah {a.numberInSurah}
                            </span>
                            <span className="text-xs text-slate-400">
                              Tap to open full Surah
                            </span>
                          </div>
                          {/* Arabic */}
                          <p className="text-2xl md:text-3xl leading-relaxed text-right font-semibold text-emerald-100 mb-2">
                            {a.text}
                          </p>
                          {/* Translation */}
                          <p className="text-sm md:text-base text-slate-200 font-bold">
                            {t?.text}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default Main;
