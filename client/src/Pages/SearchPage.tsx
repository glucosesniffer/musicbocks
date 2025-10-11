import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';


const SearchPage: React.FC = () => {
    const { query } = useParams()
    const referenceToEffect = useRef(false);
    const [artist, setArtist] = useState<{ artistImageURL: string, artistName: string}>()
    useEffect(()=> {
        if (referenceToEffect.current) return;
        referenceToEffect.current = true //once effect has run
        const fetchArtistData = async() => {
        const res = await fetch(`http://localhost:5000/search/${query}`)
        const data = await res.json()
        console.log(data)
        setArtist(data)
    }
        fetchArtistData()
}, [query])

    return(
        <div className='flex items-center justify-center'>
        {artist ?(
        <div className="flex flex-row justify-center items-center">
            <img src={artist?.artistImageURL} className='rounded-full w-[80px] hover:outline cursor-pointer'></img>
            <p className='ml-5 hover:!text-gray-400 cursor-pointer transition-colors duration-200 delay-100'>{artist?.artistName}</p>
        </div>) : (<img src="/ripples.svg" className='animate-spin'></img>)
        }
        </div>
    )
};

export default SearchPage;