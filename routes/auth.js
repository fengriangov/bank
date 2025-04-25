const express = require("express")
const bcrypt = require("bcryptjs");
const db = require("../modules/database")

const router = express.Router()

router.get("/login", (req, res) => {
    if(req.session.user) {
        return res.redirect("/user/dashboard")
    }
    res.render("login")
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.render("login", { error: "Incorrect email" });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.render("login", { error: "Incorrect password" });
        }

        req.session.user = user;
        return res.redirect('/user/dashboard');
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        return res.redirect("/login")
    });
});

module.exports = router;