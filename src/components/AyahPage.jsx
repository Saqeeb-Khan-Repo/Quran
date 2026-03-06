// AyahPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AyahPage = () => {
  const { surahNumber, ayahNumber } = useParams();
  const navigate = useNavigate();
  const [ayah, setAyah] = useState(null);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAyah = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://api.alquran.cloud/v1/quran/quran-uthmani",
        );
        const json = await res.json();
        const surah = json.data.surahs.find(
          (s) => s.number === Number(surahNumber),
        );
        if (!surah) return;
        const a = surah.ayahs.find(
          (x) => x.numberInSurah === Number(ayahNumber),
        );
        setSurahInfo(surah);
        setAyah(a || null);
      } finally {
        setLoading(false);
      }
    };
    fetchAyah();
  }, [surahNumber, ayahNumber]);

  if (loading || !ayah || !surahInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <h1 className="text-3xl md:text-4xl font-semibold">Loading Ayah…</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-emerald-300 hover:text-emerald-200"
        >
          ← Back
        </button>

        <div className="bg-slate-800/90 rounded-3xl shadow-xl p-6 md:p-10">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {surahInfo.englishName}{" "}
                <span className="text-emerald-300">({surahInfo.name})</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300">
                {surahInfo.englishNameTranslation}
              </p>
            </div>
            <span className="text-sm px-3 py-1 rounded-full bg-slate-700 text-slate-200">
              Surah {surahInfo.number} • Ayah {ayah.numberInSurah}
            </span>
          </div>

          {/* Arabic text big */}
          <p className="mt-6 text-3xl md:text-5xl leading-relaxed text-right font-semibold text-emerald-100">
            {ayah.text}
          </p>

          {/* Placeholder for translation if you add it later */}
          {/* <p className="mt-6 text-lg md:text-xl text-slate-200">
            Translation text here...
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default AyahPage;
