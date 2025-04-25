const express = require("express")
const util = require("util")
const bcrypt = require("bcryptjs");
const auth = require("../../modules/authentication")
const db = require("../../modules/database")

const router = express.Router()
const dbQuery = util.promisify(db.query).bind(db)

router.get("/", auth.admin, async (req, res) => {
    const searchQuery = req.query.search || "";

    let query = "SELECT id, first_name, last_name, email, admin FROM users";
    let params = []
    if(searchQuery){
        query += " WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?"
        params = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
    }

    const results = await dbQuery(query, params);

    return res.render("admin/users", {
        layout: "admin",
        data: results,
        searchQuery: searchQuery
    })
})

router.post("/", auth.session(true), async (req, res) => {
    const { firstName, lastName, email, password, admin } = req.body;
    const correctedAdmin = admin === "on";
    const hashedPassword = await bcrypt.hash(password, 15);

    db.query("INSERT INTO users (first_name, last_name, email, password, admin) VALUES (?, ?, ?, ?, ?)", [firstName, lastName, email, hashedPassword, correctedAdmin], (err, results) => {
        if(err) throw err;
        return res.redirect("/admin/users");
    })
})

router.post("/:id", auth.session(true), async (req, res) => {
    const userId = req.params.id;
    const { firstName, lastName, email, password, admin } = req.body;
    const correctedAdmin = admin == "on";

    let query = "UPDATE users SET first_name = ?, last_name = ?, email = ?, "
    let params = [firstName, lastName, email]

    if(password){
        const hashedPassword = await bcrypt.hash(password, 15);
        query += "password = ?, "
        params.push(hashedPassword)
    }

    query += "admin = ? WHERE id = ?"
    params.push(correctedAdmin, userId)

    db.query(query, params, (err, results) => {
        if(err) throw err;
        return res.redirect("/admin/users");
    })
})

router.delete("/:id", auth.session(true), (req, res) => {
    const userId = req.params.id;

    db.query("DELETE FROM users WHERE id = ?", [userId], (err, results) => {
        if(err) throw err;
        return res.status(200).json({ success: "OK", message: "User deleted successfully." })
    })
})

module.exports = router;