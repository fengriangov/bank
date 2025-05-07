// --- Load Environment Variables ---
require('dotenv').config();

// --- Import Core Modules ---
const express = require("express")
const exphb = require("express-handlebars")
const session = require("express-session");

// --- App Setup ---
const port = 3003;
const app = express();

// --- Templating Engine ---
const hbs = exphb.create({
    defaultLayout: "main",
    helpers: {
        eq: (a, b) => a === b,
        neq: (a, b) => a !== b
    }
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
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// --- Routes ---
app.get("/", (req, res) => {
    res.redirect("/user/dashboard")
})

app.use("/", require("./routes/auth"))
app.use("/user", require("./routes/user/main"))
app.use("/user", require("./routes/user/transfer"))
app.use("/user", require("./routes/user/transactions"))
app.use("/admin", require("./routes/admin/main"))
app.use("/admin/users", require("./routes/admin/users"))
app.use("/admin/accounts", require("./routes/admin/accounts"))

// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
