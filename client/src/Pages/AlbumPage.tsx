import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export const AlbumPage: React.FC = () => {
  const { id } = useParams();
  const effect = useRef(false);
  useEffect(() => {
    if (effect.current) return;
    effect.current = true;
    const fetchAlbumfromId = async () => {
      const res = await fetch(`http://localhost:5000/album/${id}`);
      const data = await res.json();
      console.log(data);
    };
    fetchAlbumfromId();
  }, [id]);

  return <></>;
};
