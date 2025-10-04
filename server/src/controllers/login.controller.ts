import {Request, Response} from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const loginUser = async(req: Request, res: Response): Promise<void> => {

    const {username, password}: {username: string, password: string} = req.body;
    
    
    try{
        const storedPass = await pool.query("SELECT id, password FROM users WHERE username = $1", [username]);
        const passwordMatch = await bcrypt.compare(password, storedPass.rows[0].password)

        if(passwordMatch){
            req.session.userId = storedPass.rows[0].id
            res.json({success:true, data: req.session.userId})
        }
        else{
            res.json({success:false, data: "wrong password"})
        }
    }
    catch(e){
        res.status(400).json({success:false, message: e})
    } 
}