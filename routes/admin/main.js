const express = require("express")
const auth = require("../../modules/authentication")
const db = require("../../modules/database")

const router = express.Router()

router.get("/", auth.admin, (req, res) => {
    return res.render("admin/index", { layout: "admin", user: req.session.user })
})

router.get("/dashboard", auth.admin, (req, res) => {
    db.query("SELECT (SELECT COUNT(*) FROM users) AS userCount, (SELECT COUNT(*) FROM accounts) AS accountCount", (err, results) => {
        if (err) throw err;
        const counts = results[0];

        return res.render("admin/dashboard", { layout: "admin", user: req.session.user, userCount: counts.userCount, accountCount: counts.accountCount })
    });

})

module.exports = router;