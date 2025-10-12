import { useEffect, useRef } from "react"
import { useParams } from "react-router-dom"

export const ArtistPage: React.FC = () =>{
        const { query } = useParams()
        const effect = useRef(false)
        useEffect(()=>{
            if (effect.current) return
            effect.current = true
           async function fetchAlbums(){
                const res = await fetch(`http://localhost:5000/artist/${encodeURIComponent(query)}`)
                const data = await res.json()
                console.log(data)
            }
            fetchAlbums()
        }, [])

            return(
                <>
                    <p>artist page type sht</p> 
                </>
            )   
}