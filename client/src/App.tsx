import { MainPage } from './components/MainPage'
import { Navbar } from './components/Navbar'
import './index.css'

function App() {
  return (
    <> 
      <Navbar/>
      <div className="flex justify-between p-6 w-[950px] mx-auto my-5">
          <MainPage/> 
      </div>
     </>
)}

export default App
