import dotenv from "dotenv";
import {neon} from "@neondatabase/serverless";

dotenv.config();

export const sql = neon(process.env.DataBase_URL);
export async function initDB(){
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
  id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount INT NOT NULL,
            category VARCHAR(255) NOT NULL,
            Created_at Date NOT NULL DEFAULT CURRENT_DATE
                  )`

    }catch (error){
        console.log(error)
    }
}