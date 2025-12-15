import { Request, Response, NextFunction } from "express";
import axios from "axios";
import pool from "../config/db.js";

export const albumResponse = async (req: Request, res: Response) => {
  const searchQuery = req.params.query;

  try {
    let artistResult = await pool.query(
      `SELECT * FROM artists WHERE name = $1`,
      [searchQuery],
    );
    let artist = artistResult.rows[0];

    if (!artist) {
      const spotifyArtist = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchQuery,
        )}&type=artist&limit=1`,
      );

      const foundArtist = spotifyArtist.data.artists.items[0];
      if (!foundArtist) {
        return res
          .status(404)
          .json({ success: false, message: "Artist not found" });
      }

      const insertArtist = await pool.query(
        `INSERT INTO artists (name, spotify_id, image)
         VALUES ($1, $2, $3)
         ON CONFLICT (spotify_id) DO NOTHING
         RETURNING *`,
        [foundArtist.name, foundArtist.id, foundArtist.images[0]?.url || null],
      );

      artist =
        insertArtist.rows[0] ||
        (
          await pool.query(`SELECT * FROM artists WHERE spotify_id = $1`, [
            foundArtist.id,
          ])
        ).rows[0];
    }

    let offset = 0;
    let albums: any[] = [];
    const limit = 50; // Spotify API max limit per request

    while (true) {
      const albumsResponse = await axios.get(
        `https://api.spotify.com/v1/artists/${artist.spotify_id}/albums?limit=${limit}&offset=${offset}&include_groups=album`,
      );
      const items = albumsResponse.data.items;
      if (!items || items.length === 0) break;
      albums = albums.concat(items);
      offset += limit;
      if (!albumsResponse.data.next) break;
    }

    for (const album of albums) {
      await pool.query(
        `INSERT INTO albums (spotify_id, title, year, image, artist_id)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (spotify_id) DO NOTHING`,
        [
          album.id,
          album.name,
          album.release_date,
          album.images[0]?.url || null,
          artist.id,
        ],
      );
    }

    const allAlbums = await pool.query(
      `SELECT * FROM albums WHERE artist_id = $1`,
      [artist.id],
    );

    res.json({
      artist: {
        id: artist.id,
        name: artist.name,
        image: artist.image,
        genre: artist.genre,
      },
      albums: allAlbums.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
