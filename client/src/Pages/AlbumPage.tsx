import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const AlbumPage: React.FC = () => {
  const { id } = useParams();
  const [albumInfo, setInfo] = useState();
  const effect = useRef(false);
  const [session, setSession] = useState(null);
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
    const sessionid = localStorage.getItem("sessionId");
    setSession(sessionid);
  }, [id]);
  function handleCurrentSession() {
    if (!session) console.log("login first");
    return;
  }
  const user_id = albumInfo?.user_id; //fix this shit
  const album_id = albumInfo?.id;
  const addRating = async (rating: number) => {
    await axios.post("http://localhost:5000/review", {
      rating,
      user_id,
      album_id,
    });
  };
  // console.log(rating);
  return (
    <div className="flex flex-row justify-evenly items-center w-full">
      <div className="">
        <img src={albumInfo?.image} className="rounded-md w-[250px]"></img>
      </div>
      <div className="flex flex-col items-center">
        <p className="mt-2 font-bold max-w-[500px] font-bold !text-4xl">
          {albumInfo?.title}
        </p>
        <p className="mt-2 text-zinc-400 text-s">Album</p>
        <p className="text-xs text-zinc-500 mt-1">{albumInfo?.year}</p>
        <div className="rating rating-xl" onClick={handleCurrentSession}>
          <input
            type="radio"
            name="rating-1"
            className="mask mask-star bg-blue-500"
            aria-label="1 star"
            value="1"
            disabled={!session}
            onChange={async (e: any) => {
              await addRating(e.target.value);
            }}
          />
          <input
            type="radio"
            name="rating-1"
            className="mask mask-star bg-blue-500"
            aria-label="2 star"
            value="2"
            disabled={!session}
            onChange={async (e: any) => {
              await addRating(e.target.value);
            }}
          />
          <input
            type="radio"
            name="rating-1"
            className="mask mask-star bg-blue-500"
            aria-label="3 star"
            disabled={!session}
            value="3"
            onChange={async (e: any) => {
              await addRating(e.target.value);
            }}
          />
          <input
            type="radio"
            name="rating-1"
            className="mask mask-star bg-blue-500"
            aria-label="4 star"
            disabled={!session}
            value="4"
            onChange={async (e: any) => {
              await addRating(e.target.value);
            }}
          />

          <input
            type="radio"
            name="rating-1"
            className="mask mask-star bg-blue-500"
            aria-label="5 star"
            disabled={!session}
            value="5"
            onChange={async (e: any) => {
              await addRating(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
