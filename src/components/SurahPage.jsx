import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SurahPage = () => {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://api.alquran.cloud/v1/quran/quran-uthmani",
        );
        const json = await res.json();
        const found = json.data.surahs.find(
          (s) => s.number === Number(surahNumber),
        );
        if (!found) {
          setError("Surah not found");
        } else {
          setSurah(found);
        }
      } catch (e) {
        setError("Failed to load Surah");
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSurah();
  }, [surahNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <h1 className="text-3xl md:text-4xl font-semibold">Loading Surah…</h1>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-red-400">
        <p>{error || "Surah not found"}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 rounded bg-slate-700 text-slate-100"
        >
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-emerald-300 hover:text-emerald-200"
        >
          ← Back
        </button>

        <div className="bg-slate-800/90 rounded-3xl shadow-xl p-6 md:p-8">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {surah.englishName}{" "}
                <span className="text-emerald-300">({surah.name})</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300">
                {surah.englishNameTranslation}
              </p>
            </div>
            <span className="text-sm px-3 py-1 rounded-full bg-slate-700 text-slate-200">
              Surah {surah.number} • Ayahs {surah.numberOfAyahs}
            </span>
          </div>

          <div className="mt-6 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {surah.ayahs.map((a) => (
              <div
                key={a.number}
                className="rounded-2xl bg-slate-900/60 px-4 py-3"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-emerald-300 font-semibold">
                    Ayah {a.numberInSurah}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl leading-relaxed text-right font-semibold text-emerald-100">
                  {a.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurahPage;
