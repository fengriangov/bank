const express = require("express")
const util = require("util")
const auth = require("../../modules/authentication")
const db = require("../../modules/database")

const router = express.Router()
const dbQuery = util.promisify(db.query).bind(db)

router.get('/transactions', auth.user, async (req, res) => {
    const userAccounts = await dbQuery("SELECT * from accounts WHERE user_id = ?", [req.session.user.id])
    const selectedAccount = null;
    return res.render("user/transactions", { user: req.session.user, userAccounts: userAccounts, selectedAccount: selectedAccount });
});

module.exports = router;