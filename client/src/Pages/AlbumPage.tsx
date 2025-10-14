import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export const AlbumPage: React.FC = () => {
  const { id } = useParams();
  const [albumInfo, setInfo] = useState();
  const effect = useRef(false);
  useEffect(() => {
    if (effect.current) return;
    effect.current = true;
    const fetchAlbumfromId = async () => {
      const res = await fetch(`http://localhost:5000/album/${id}`);
      const data = await res.json();
      console.log(data);
      setInfo(data);
    };
    fetchAlbumfromId();
  }, [id]);

  return (
    <div className="flex flex-row justify-evenly items-center w-full">
      <div className="">
        <img src={albumInfo?.image} className="rounded-md w-[250px]"></img>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="mt-2 font-bold max-w-[500px]">{albumInfo?.title}</h1>
        <p className="mt-2 text-zinc-400 text-s">Album</p>
        <p className="text-xs text-zinc-500 mt-1">{albumInfo?.year}</p>
      </div>
    </div>
  );
};
