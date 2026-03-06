import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSurah, setExpandedSurah] = useState(null);
  const navigate = useNavigate();

  // import { useNavigate } from "react-router-dom";

  const openSurah = (surahNumber) => {
    navigate(`/surah/${surahNumber}`);
  };

  const fetchAPI = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://api.alquran.cloud/v1/quran/quran-uthmani",
      );
      const json = await res.json();
      setSurahs(json.data.surahs);
      console.log(json);
    } catch (err) {
      console.error("api error", err);
      setError("Failed to load Quran data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

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

  const toggleSurah = (number) => {
    setExpandedSurah((prev) => (prev === number ? null : number));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="max-w-5xl mx-auto px-4 pt-10 pb-6 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
          القرآن الكريم
        </h1>
        <h2 className="text-lg md:text-2xl text-slate-300">
          Quran Kareem
        </h2>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-10 space-y-4">
        {surahs.map((surah) => {
          const isOpen = expandedSurah === surah.number;

          return (
            <div
              key={surah.number}
              className={`transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer
                bg-slate-800/80 border border-slate-700 shadow-md hover:shadow-xl 
                ${isOpen ? "ring-2 ring-emerald-400" : ""}`}
              onClick={() => toggleSurah(surah.number)}
            >
              {/* Header */}
              <div className="flex items-center gap-4 p-4 md:p-5">
                <div className="shrink-0 h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-xl font-bold">
                  {surah.number}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold">
                        {surah.englishName}{" "}
                        <span className="text-emerald-300">({surah.name})</span>
                      </h3>
                      <p className="text-sm md:text-base text-slate-300">
                        {surah.englishNameTranslation}
                      </p>
                    </div>
                    <span className="text-xs md:text-sm px-3 py-1 rounded-full bg-slate-700 text-slate-200">
                      Ayahs: {surah.numberOfAyahs}
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
                    {surah.ayahs.map((a) => (
                      <button
                        key={a.number}
                        type="button"
                        onClick={() => openSurah(surah.number)} // ← only surah number
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
                        <p className="text-2xl md:text-3xl leading-relaxed text-right font-bold text-shadow-cyan-400">
                          {a.text}
                        </p>
                      </button>
                    ))}
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
