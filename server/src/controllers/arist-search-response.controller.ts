import { Request, Response } from "express";
import axios from "axios";
import pool from "../config/db.js";

interface AxiosResponse {
  artists: {
    items: {
      name: string;
      id: string;
      genres: string[];
      images: {
        url: string;
      }[];
    }[];
  };
}

export const artistResponse = async (req: Request, res: Response) => {
  const searchQuery = req.params.query;

  try {
    const spotifyResponse = await axios.get<AxiosResponse>(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=artist&limit=10`,
    );

    const artists = spotifyResponse.data.artists?.items || [];

    if (artists.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No artists found" });
    }

    const artistResults = [];

    for (const artist of artists) {
      const artistName = artist.name;
      const artistId = artist.id;
      const artistImage = artist.images?.[0]?.url || null;
      const artistGenre = artist.genres?.[0] || null;

      const checkDBForArtist = await pool.query(
        `SELECT * FROM artists WHERE name = $1 OR spotify_id = $2`,
        [artistName, artistId],
      );

      let artistRow;
      if (checkDBForArtist.rows.length === 0) {
        const insertedRow = await pool.query(
          "INSERT INTO artists(spotify_id, name, image, genre) VALUES($1, $2, $3, $4) RETURNING *",
          [artistId, artistName, artistImage, artistGenre],
        );
        artistRow = insertedRow.rows[0];
      } else {
        artistRow = checkDBForArtist.rows[0];
      }

      artistResults.push({
        id: artistRow.id,
        artistName: artistRow.name,
        artistImageURL: artistRow.image,
        artistGenre: artistRow.genre,
      });
    }

    res.json(artistResults);
  } catch (error: any) {
    console.error("Error in artistResponse:", error);
    if (error.response?.status === 401) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Spotify API authentication failed. Check your credentials.",
        });
    }
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to search for artist",
      });
  }
};
