const express = require("express")
const util = require("util")
const auth = require("../../modules/authentication")
const db = require("../../modules/database")

const router = express.Router()
const dbQuery = util.promisify(db.query).bind(db)

router.get('/dashboard', auth.user, async (req, res) => {
    const accounts = await dbQuery("SELECT * from accounts WHERE user_id = ?", [req.session.user.id])
    return res.render("user/dashboard", { user: req.session.user, accounts: accounts });
});

module.exports = router