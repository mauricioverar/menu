import { pool } from "../db.js";

export const index = (req, res) => res.json({ 
  message: "welcome to my api",
});