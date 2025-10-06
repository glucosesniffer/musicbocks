import { Request, Response } from "express";
import pool from "../config/db.js";

export const albumInfo = async(req: Request, res: Response):Promise<void> =>{
        const album_id = req.params.query
        try{
            const result = await pool.query(`SELECT * FROM albums WHERE id=$1 LIMIT 100`, [album_id])
            res.json(result.rows[0])
        }
        catch(e){
            res.status(400).json({success:false, message: e})
        }
    }