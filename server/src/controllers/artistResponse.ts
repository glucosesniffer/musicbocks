import { Request, Response } from "express";
import axios from "axios";
import pool from "../config/db.js";
import { start } from "repl";

interface AxiosResponse{
  artists:{
    items: {
      name:string;
      id: string;
      genres: string[];
      images:{
        url: string;
      }[];
    }[];
  };
}

export const artistResponse = async(req:Request, res: Response) => {
  let artistRow;
  
  const searchQuery = req.params.query;
  
  try {
    const spotifyResponse = await axios.get<AxiosResponse>(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=artist`);
    const startingQueryText = spotifyResponse.data.artists.items[0]
    const artistName = startingQueryText.name
    const artistId = startingQueryText.id
    const artistImage = startingQueryText.images[0].url
    const artistGenre = startingQueryText.genres[0]
    const checkDBForArtist = await pool.query(`SELECT * FROM artists WHERE name = $1`, [artistName])

    if (checkDBForArtist.rows.length === 0) {
        const insertedRow = await pool.query(
          'INSERT INTO artists(spotify_id, name, image, genre) VALUES($1, $2, $3, $4) RETURNING *',
          [artistId, artistName, artistImage, artistGenre]
        );
        artistRow = insertedRow.rows[0]

      }
      else{
        artistRow = checkDBForArtist.rows[0]
      }
    
    res.json({id: artistRow.spotify_id, artistName:artistRow.name , artistImageURL: artistRow.image, artistGenre: artistRow.genre});
  }
  catch(error){
    res.status(500).json({success:false, message: (error as Error).message})
  }
}