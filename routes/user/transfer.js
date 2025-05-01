const express = require("express")
const util = require("util")
const auth = require("../../modules/authentication")
const db = require("../../modules/database")

const router = express.Router()
const dbQuery = util.promisify(db.query).bind(db)

router.get("/transfer", auth.user, async (req, res) => {
    const userAccounts = await dbQuery("SELECT * from accounts WHERE user_id = ?", [req.session.user.id])
    return res.render("user/transfer", { user: req.session.user, userAccounts: userAccounts })
});

router.post("/transfer", async (req, res) => {
    const { sendingAccountNum, receivingAccountNum, amount: amountString } = req.body;
    const amount = parseFloat(amountString)
    const sendAccountCheck = await dbQuery("SELECT COUNT(*) AS count FROM accounts WHERE user_id = ? AND account_number = ?", [req.session.user.id, sendingAccountNum])
    let exists = sendAccountCheck[0].count > 0;
    if(!exists){
        return res.status(401).json({ error: "Unauthorised", message: "You can't transfer money from an account that doesn't belong to you." })
    }
    const receiveAccountCheck = await dbQuery("SELECT COUNT(*) AS count FROM accounts WHERE account_number = ?", [receivingAccountNum])
    exists = receiveAccountCheck[0].count > 0;
    if(!exists){
        return res.status(400).json({ error: "Bad Request", message: "You can't transfer to an account that doesn't exist." })
    }

    const sendingAccount = (await dbQuery("SELECT * from accounts WHERE account_number = ?", [sendingAccountNum]))[0];
    const receivingAccount = (await dbQuery("SELECT * from accounts WHERE account_number = ?", [receivingAccountNum]))[0];

    const newReceiverBalance = (parseFloat(receivingAccount.balance) + amount);
    const newSenderBalance = (parseFloat(sendingAccount.balance) - amount);
    if(newSenderBalance < 0){
        return res.status(400).json({ error: "Bad Request", message: "You cannot afford this transaction." })
    }
    if(amount <= 0){
        return res.status(400).json({ error: "Bad Request", message: "You can't transfer less than $1" })
    }

    await dbQuery("UPDATE accounts SET balance = ? WHERE account_number = ?", [newSenderBalance, sendingAccountNum])
    await dbQuery("UPDATE accounts SET balance = ? WHERE account_number = ?", [newReceiverBalance, receivingAccountNum])

    await dbQuery("INSERT INTO transactions (sending_account_id, amount, description, receiving_account_id) VALUES (?, ?, ? ,?)", [sendingAccount.id, amount, `Transfer from ${sendingAccountNum} to ${receivingAccountNum}`, receivingAccount.id]);
    return res.status(200).json({ success: "OK", message: "Successfully transferred balance." });
});

module.exports = router;