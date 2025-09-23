import express from "express";
import pool from "./config/db.js";

const app = express();
app.use(express.json());

const PORT = 5000

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users;");
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({success:false, error: error.message})
  }
});

app.post("/create-account", async(req,res) => {
    const {username, email, password} = req.body

  try {
      await pool.query("INSERT INTO users(username, email, password) VALUES($1,$2,$3)",
        [username,email, password]
      )
      res.status(200).json({success:false, data: "User created successufully"})
  } catch (error) {
      res.status(500).json({success:false, error: error.message})
  }
})

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`);
});
