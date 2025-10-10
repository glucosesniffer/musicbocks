import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainPage } from './Pages/MainPage'
import { Navbar } from './components/Navbar' 
import './index.css'
import SearchPage from './Pages/SearchPage'
import { ArtistPage } from './Pages/AristPage'

function App() {
  return (
    <BrowserRouter> 
      <Navbar/>
      <div className="flex justify-between p-6 w-[950px] mx-auto my-5">
          <Routes>
              <Route path="/" element={<MainPage/>} />
              <Route path="/search/:query" element={<SearchPage/>} />
              <Route path="/artist/:query" element={<ArtistPage/>}/>
          </Routes> 
      </div>
     </BrowserRouter>
)}

export default App
