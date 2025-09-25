import express from "express";
import { Request, Response } from "express";
import axios from "axios";

export const spotifyResponse = async(req:Request, res: Response) => {
  const searchQuery = req.params.query;
  try {
    const spotifyResponse = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=artist,album,track`);
    res.status(200).json(spotifyResponse.data);
  }
  catch(error){
    res.status(500).json({success:false, message: (error as Error).message})
  }
}