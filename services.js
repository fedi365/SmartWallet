import express from "express";
import {sql} from "./db.js";
const app=express();
app.use(express.json())
export async function get_transactions(req, res)  {
    try {
        const transactions = await sql`
            SELECT * FROM transactions
        `;
        console.log(transactions);

        res.status(200).json(transactions);
    } catch (error) {
        console.error("Erreur dans la récupération des transactions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function add_transaction(req, res) {
    try {
        const { user_id, title, amount, category } = req.body;

        if (!user_id || !title || !amount || !category) {
            return res.status(400).json({ message: "Please provide all the fields" });
        }

        await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
    `;
        console.log("Transaction added successfully");
        res.status(200).json({ message: "Transaction added successfully" });
    } catch (error) {
        console.error("Erreur dans l'insertion:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function suppuserbyid (req, res) {
    const { id } = req.params;

    try {
        // Suppression avec retour de la ligne supprimée
        const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *;
    `;

        if (result.length === 0) {
            // si aucune transaction supprimée → id inexistant
            return res.status(404).json({ message: "Transaction introuvable !" });
        }

        // si trouvé et supprimé
        console.log("Transaction supprimée:", result[0]);
        res.status(200).json({ message: "Transaction supprimée avec succès !" });
    } catch (error) {
        console.error("Erreur dans la suppression de la transaction:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
export async function getuserbyid (req, res){
    const { user_id } = req.params
    try {
        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${user_id}`;

        if (transactions.length===0){
            return res.status(404).json({message:"No transactions found for this user"})
        }
        res.status(200).json(transactions);

    }catch (error){
        res.status(500).json({message:"Internal server error"})

    }
}
export async function summaryasync (req, res) {
    try {
        const { user_id } = req.params;

        // Dépenses (amount < 0)
        const expenses = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expense
            FROM transactions
            WHERE user_id = ${user_id} AND amount < 0
        `;

        // Revenus (amount > 0)
        const incomes = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income
            FROM transactions
            WHERE user_id = ${user_id} AND amount > 0
        `;

        const balance = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance
            FROM transactions
            WHERE user_id = ${user_id}
        `;

        const summary = {
            expenses: expenses[0].expense,
            incomes: incomes[0].income,
            balance: balance[0].balance
        };

        res.status(200).json(summary);
    } catch (error) {
        console.error("on peut pas calculer le summary", error);
        res.status(500).json({ message: "Internal server error" });
    }
}