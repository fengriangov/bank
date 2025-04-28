// --- Load Environment Variables ---
require('dotenv').config();

// --- Import Core Modules ---
const express = require("express")
const exphb = require("express-handlebars")
const session = require('express-session');

// --- App Setup ---
const port = 3003;
const app = express();

// --- Templating Engine ---
const hbs = exphb.create({
    defaultLayout: "main"
})
app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")

// --- Middleware ---
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// --- Routes ---
app.get("/", (req, res) => {
    res.send("HOME PAGE")
})

app.use("/", require("./routes/auth"))
app.use("/user", require("./routes/user/main"))
app.use("/user", require("./routes/user/transfer"))
app.use("/admin", require("./routes/admin/main"))
app.use("/admin/users", require("./routes/admin/users"))
app.use("/admin/accounts", require("./routes/admin/accounts"))

// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
