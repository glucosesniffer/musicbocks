import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const SearchPage: React.FC = () => {
    const { query } = useParams()
    const referenceToEffect = useRef(false);

    useEffect(()=> {
        if (referenceToEffect.current) return;
        referenceToEffect.current = true //once effect has run
        const fetchArtistData = async() => {
        const res = await fetch(`http://localhost:5000/search/${query}`)
        const data = await res.json()
        console.log(data)}
        fetchArtistData()
}, [query])

    return(
        <>
        </>
    )
};

export default SearchPage;