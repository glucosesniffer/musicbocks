import { Request, Response } from "express";
import pool from "../config/db.js";

export const mainPage = async(req: Request, res: Response): Promise<void> => {
    try{
        const result = await pool.query('SELECT * FROM albums ORDER BY RANDOM() LIMIT 16')
        res.json({success:true, data: result.rows})
    }
    catch(e){
        res.status(400).json({success:false, e})
    }
}