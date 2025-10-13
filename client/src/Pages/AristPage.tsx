import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

export const ArtistPage: React.FC = () =>{
        const { query } = useParams()
        const effect = useRef(false)
        const [artistAlbums, setArtistAlbums] = useState([])
        useEffect(()=>{
            if (effect.current) return
            effect.current = true
           async function fetchAlbums(){
                const res = await fetch(`http://localhost:5000/artist/${encodeURIComponent(query)}`)
                const data = await res.json()
                setArtistAlbums(data)
            }
            fetchAlbums()
        }, [])

            return(
                <>
             <div className="flex flex-row overflow-x-auto space-x-4 p-2">
  {artistAlbums.map((album) => (
    <div key={album?.id} className="flex-shrink-0">
      <img
        src={album?.image}
        alt={album?.name}
        className="w-32 h-32 object-cover rounded-md"
      />
      <p className="mt-2 text-center text-sm font-medium">{album?.name}</p>
    </div>
  ))}
</div>

                </>
            )   
}