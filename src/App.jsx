// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import SurahPage from "./components/SurahPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Quran" element={<Main />} />
        <Route path="/Quran/surah/:surahNumber" element={<SurahPage />} />
        <Route path="/surah/:surahNumber" element={<SurahPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
