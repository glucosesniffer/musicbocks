import { Request, Response } from "express";
import axios from "axios"

export const mainPage = async(req: Request, res: Response): Promise<void> => {
    try{
        const response = await axios.get("https://api.spotify.com/v1/browse/new-releases")
        res.status(200).json({success: true, message: response})
    }
    catch(e){
        res.status(400.).json({success: false, error: e})
    }
}