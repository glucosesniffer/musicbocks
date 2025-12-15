import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage } from "./Pages/MainPage";
import { Navbar } from "./components/Navbar";
import "./index.css";
import SearchPage from "./Pages/SearchPage";
import { ArtistPage } from "./Pages/AristPage";
import { AlbumPage } from "./Pages/AlbumPage";
import { ProfilePage } from "./Pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="*"
          element={
            <div className="flex justify-between p-6 w-[950px] mx-auto my-5">
              <Routes>
                <Route path="/search/:query" element={<SearchPage />} />
                <Route path="/artist/:query" element={<ArtistPage />} />
                <Route path="/album/:id" element={<AlbumPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
