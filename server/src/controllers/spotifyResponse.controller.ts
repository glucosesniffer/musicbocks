import { Request, Response } from "express";
import axios from "axios";
import pool from "../config/db.js";

interface AxiosResponse{   //this is an ugly fucking way to declare types please ignore
  tracks: {
    items: {
      album: {
        name: string;
        artists: {
          name: string;
          id:string;
        }[];
      }
    }[];
  };
}

export const spotifyResponse = async(req:Request, res: Response) => {
  let artistRow;
  
  const searchQuery = req.params.query;
  
  try {
    const spotifyResponse = await axios.get<AxiosResponse>(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=artist,album,track`);
    const queryText = spotifyResponse.data.tracks.items[0].album.artists[0]
    const artistName = queryText.name
    const artistId = queryText.id

    const checkDBForArtist = await pool.query(`SELECT * FROM artists WHERE name = $1`, [artistName])

    if (checkDBForArtist.rows.length === 0) {
      const insertedRow = await pool.query(
        'INSERT INTO artists(spotify_id, name) VALUES($1, $2) RETURNING *',
        [artistId, artistName]
      );
      artistRow = insertedRow.rows[0]

    }
    else{
      artistRow = checkDBForArtist.rows[0]
    }
    
    res.json(artistRow.name);
  }
  catch(error){
    res.status(500).json({success:false, message: (error as Error).message})
  }
}