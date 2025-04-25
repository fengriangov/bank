const express = require("express")
const util = require("util")
const auth = require("../../modules/authentication")
const db = require("../../modules/database")

const router = express.Router()
const dbQuery = util.promisify(db.query).bind(db)

async function generateUniqueAccountNumber(db){
    let accountNumber;
    let exists;

    do {
        accountNumber = Math.floor(100000 + Math.random() * 900000);
        const rows = await dbQuery("SELECT COUNT(*) AS count FROM accounts WHERE account_number = ?", [accountNumber])
        exists = rows[0].count > 0;
    } while(exists);

    return accountNumber;
}

router.get("/", auth.admin, async (req, res) => {
    const searchQuery = req.query.search || "";

    let query = "SELECT id, user_id, account_number, account_type, balance FROM accounts";
    let params = []
    if(searchQuery){
        query += " WHERE user_id LIKE ? OR account_number LIKE ?"
        params = [`%${searchQuery}%`, `%${searchQuery}%`]
    }

    const results = await dbQuery(query, params);

    return res.render("admin/accounts", {
        layout: "admin",
        data: results,
        searchQuery: searchQuery
    })
})

router.post("/", auth.session(true), async (req, res) => {
    const { accountOwner, accountType, balance } = req.body;

    const accountOwnerCheck = await dbQuery("SELECT COUNT(*) AS count FROM user WHERE id = ?", [accountOwner])
    let exists = accountOwnerCheck[0].count > 0;
    if(!exists){
        return res.status(400).json({ error: "Bad Request", message: "The specified account owner does not exist." })
    }

    db.query("INSERT INTO accounts (user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?)", [accountOwner, await generateUniqueAccountNumber(db), accountType, balance], (err, results) => {
        if(err) throw err;
        return res.status(200).json({ success: "OK", message: "Successfully created account." })
    })
})

router.post("/:id", auth.session(true), async (req, res) => {
    const accountId = req.params.id;
    const { accountOwner, accountType, balance } = req.body;

    const accountOwnerCheck = await dbQuery("SELECT COUNT(*) AS count FROM user WHERE id = ?", [accountOwner])
    let exists = accountOwnerCheck[0].count > 0;
    if(!exists){
        return res.status(400).json({ error: "Bad Request", message: "The specified account owner does not exist." })
    }

    const editedAccountCheck = await dbQuery("SELECT COUNT(*) AS count FROM accounts WHERE account_id = ?", [accountId])
    exists = editedAccountCheck[0].count > 0;
    if(!exists){
        return res.status(400).json({ error: "Bad Request", message: "The account you attempted to edit does not exist." })
    }

    db.query("UPDATE accounts SET user_id = ?, account_type = ?, balance = ? WHERE id = ?", [accountOwner, accountType, balance, accountId], (err, results) => {
        if(err) throw err;
        return res.status(200).json({ success: "OK", message: "Succesfully updated account." });
    })
})

router.delete("/:id", auth.session(true), (req, res) => {
    const accountId = req.params.id;

    db.query("DELETE FROM accounts WHERE id = ?", [accountId], (err, results) => {
        if(err) throw err;
        return res.status(200).json({ success: "OK", message: "Account deleted successfully." })
    })
})

module.exports = router;