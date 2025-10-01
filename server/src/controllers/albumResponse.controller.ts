import { Request, Response } from "express";
import axios from "axios";
import pool from "../config/db.js";
import { artistResponse } from "./artistResponse.js";
import { NextFunction } from "express";

interface AxiosResponse{
  albums:{
    items: {
      name:string;
      release_date: string;
      id: string;
      artists: {
        id: string;
      }[];
      genres: string[];
      images:{
        url: string;
      }[];
    }[];
  };
}

export const albumResponse = async(req:Request, res: Response, next: NextFunction) => {
  let albumsArr: {name: string; year:string; image: string; spotify_id: string}[] = [];
  const searchQuery = req.params.query;
  const insertedAlbums = [];

  try {
    const spotifyResponse = await axios.get<AxiosResponse>(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=album`);
    
    const firstAlbum = spotifyResponse.data.albums
    firstAlbum.items.forEach((album) =>{
        albumsArr.push({
        name :  album?.name,
        year : album?.release_date,
        image: album?.images[0].url,
        spotify_id: album?.artists[0].id
        })
    })
    for (const album of albumsArr){

    const results = await pool.query(
    `INSERT INTO albums (title, year, image, artist_id)
     SELECT $1, $2, $3, id
     FROM artists
     WHERE spotify_id = $4
     RETURNING *`,
    [album.name, album.year, album.image, album.spotify_id]
  );

    if (results.rows.length > 0) {
    insertedAlbums.push(results.rows[0]);
    }
    else{
      return artistResponse(req, res, next)
    }
    }
    res.json(insertedAlbums)
  }
  catch(error){
    res.status(500).json({success:false, message: (error as Error).message})
  }
}