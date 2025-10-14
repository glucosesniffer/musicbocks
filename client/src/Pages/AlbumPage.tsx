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
    <div className="flex mx-auto justify-center items-center">
      <img src={albumInfo?.image} className="rounded-md w-[250px]"></img>
    </div>
  );
};
