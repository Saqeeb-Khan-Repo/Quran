// SurahPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const SurahPage = () => {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [arabic, setArabic] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // read lang from query, default to "en"
  const searchParams = new URLSearchParams(location.search);
  const lang = searchParams.get("lang") === "ur" ? "ur" : "en";
  const editionForLang = lang === "en" ? "en.asad" : "ur.jalandhry";

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,${editionForLang}`,
        );
        const json = await res.json();

        if (!json.data || json.data.length < 2) {
          setError("Could not load Surah");
          return;
        }

        setArabic(json.data[0]); // Arabic
        setTranslation(json.data[1]); // Translation
      } catch (e) {
        console.error(e);
        setError("Failed to load Surah");
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, [surahNumber, editionForLang]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <h1 className="text-3xl md:text-4xl font-semibold">Loading Surah…</h1>
      </div>
    );
  }

  if (error || !arabic || !translation) {
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

  const meta = arabic; // has name, englishName, number, numberOfAyahs

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-emerald-300 hover:text-emerald-200"
          >
            ← Back
          </button>

          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-200">
              Surah {meta.number}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-200">
              Ayahs {meta.numberOfAyahs}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-200">
              {lang === "en" ? "English" : "Urdu"} translation
            </span>
          </div>
        </div>

        <div className="bg-slate-800/90 rounded-3xl shadow-xl p-6 md:p-8">
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              {meta.englishName}{" "}
              <span className="text-emerald-300">({meta.name})</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300">
              {meta.englishNameTranslation}
            </p>
          </div>

          <div className="mt-6 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {arabic.ayahs.map((a, idx) => {
              const t = translation.ayahs[idx];
              return (
                <div
                  key={a.number}
                  className="rounded-2xl bg-slate-900/60 px-4 py-3"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm text-emerald-300 font-semibold">
                      Ayah {a.numberInSurah}
                    </span>
                  </div>

                  {/* Arabic */}
                  <p className="text-2xl md:text-3xl leading-relaxed text-right font-semibold text-emerald-100 mb-2">
                    {a.text}
                  </p>

                  {/* Translation */}
                  <p className="text-sm md:text-base text-slate-200">
                    {t?.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurahPage;
