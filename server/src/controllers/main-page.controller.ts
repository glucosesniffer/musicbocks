import { Request, Response } from "express";
import pool from "../config/db.js";

export const mainPage = async(req: Request, res: Response): Promise<void> => {
    try{
        res.json({success:true, message: "yay it works!"})
    }
    catch(e){
        res.status(400).json({success:false, e})
    }
}