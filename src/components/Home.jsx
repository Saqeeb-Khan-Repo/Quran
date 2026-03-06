import { useState, useEffect } from "react";

const Home = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSurah, setExpandedSurah] = useState(null);

  const fetchAPI = async () => {
    try {
      setLoading(true);
      const api = await fetch("https://api.alquran.cloud/v1/quran/ar.alafasy");
      const res = await api.json();
      setSurahs(res.data.surahs);
    } catch (err) {
      setError("Failed to fetch Quran data");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  if (loading)
    return (
      <div className="loading h-screen w-full flex justify-center items-center">
        <h1 className="text-4xl font-semibold">Loading....</h1>
      </div>
    );

  if (error) return <div className="error">{error}</div>;

  const toggleAyahs = (surahNumber) => {
    setExpandedSurah(expandedSurah === surahNumber ? null : surahNumber);
  };

  return (
    <div className="quran-app min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-green-700">
          القرآن الكريم
        </h1>
        <p className="text-xl text-gray-600 text-center">
          Listen to Quran - Mishary Alafasy
        </p>
      </header>

      <section className="max-w-6xl mx-auto px-4 pb-10 space-y-4">
        {surahs.map((surah) => {
          const isOpen = expandedSurah === surah.number;
          return (
            <div
              key={surah.number}
              className={`transition-all duration-300 rounded-2xl shadow-md overflow-hidden cursor-pointer bg-white/80 border border-gray-100
                ${isOpen ? "w-full" : "hover:shadow-xl"}`}
              onClick={() => toggleAyahs(surah.number)}
            >
              {/* Horizontal card header */}
              <div className="flex flex-col md:flex-row items-stretch">
                {/* Left badge / number */}
                <div className="md:w-20 w-full md:border-r border-b md:border-b-0 border-gray-200 flex md:flex-col items-center justify-center bg-emerald-100">
                  <span className="text-sm text-gray-600 md:mb-1">Surah</span>
                  <span className="text-2xl font-extrabold text-emerald-700">
                    {surah.number}
                  </span>
                </div>

                {/* Main info */}
                <div className="flex-1 p-4 md:p-6 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                        {surah.englishName}{" "}
                        <span className="text-emerald-700">({surah.name})</span>
                      </h2>
                      <p className="text-sm md:text-base text-gray-600">
                        {surah.englishNameTranslation}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-500">
                      <span className="px-3 py-1 rounded-full bg-gray-100">
                        Ayahs: {surah.numberOfAyahs}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full font-medium ${
                          isOpen
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {isOpen ? "Close" : "Details"}
                      </span>
                    </div>
                  </div>

                  {/* Show audio only when open */}
                  {isOpen && (
                    <div className="mt-4">
                      <audio
                        controls
                        className="w-full"
                        src={`/api/surah-audio/ar.alafasy/${surah.number}`}
                      />
                    </div>
                  )}
                </div>
              </div>
              

              {/* Expanded area: full width */}
              {isOpen && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="max-h-96 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {surah.ayahs.slice(0, 10).map((ayah) => (
                      <div
                        key={ayah.number}
                        className="ayah-item p-3 md:p-4 bg-white rounded-xl shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-emerald-700">
                            ({ayah.number})
                          </span>
                          <span className="text-xs text-gray-500">
                            {surah.name}
                          </span>
                        </div>
                        <p className="w-full text-blue-500 font-semibold text-2xl md:text-3xl leading-loose text-right">
                          {ayah.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Home;
