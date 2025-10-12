import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SearchPage: React.FC = () => {
    const { query } = useParams()
    const referenceToEffect = useRef(false);
    const navigate = useNavigate()
    const [artist, setArtist] = useState<{ artistImageURL: string, artistName: string, id : string}>()
    useEffect(()=> {
        if (referenceToEffect.current) return;
        referenceToEffect.current = true //once effect has run
        const fetchArtistData = async() => {
        const res = await fetch(`http://localhost:5000/search/${query}`)
        const data = await res.json()
        setArtist(data)
    }
        fetchArtistData()
}, [query])

   function handleSearch(e: React.FormEvent){
    e.preventDefault()
    const name= artist?.artistName ?? "unknown"
    navigate(`/artist/${encodeURIComponent(name)}`)
}
    return(
        <div className='flex items-center justify-center'>
        {artist ?(
        <div key={artist?.id} className="flex flex-row justify-center items-center">
            <img src={artist?.artistImageURL} className='rounded-full w-[80px] hover:outline cursor-pointer'></img>
            <p className='ml-5 hover:!text-gray-400 cursor-pointer transition-colors duration-200 delay-100' onClick={handleSearch}>{artist?.artistName}</p>
        </div>) : (<img src="/ripples.svg" className='animate-spin'></img>)
        }
        </div>
    )
};

export default SearchPage;