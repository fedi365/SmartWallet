import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config();

export const sql = neon(process.env.DataBase_URL);

export async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS transactions (
                                                        id SERIAL PRIMARY KEY,
                                                        user_id VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                amount INT NOT NULL,
                category VARCHAR(255) NOT NULL,
                created_at DATE NOT NULL DEFAULT CURRENT_DATE
                )
        `;
        console.log("Table 'transactions' ready !");
    } catch (error) {
        console.error("Erreur lors de la création de la table :", error);
    }
}
