module.exports = {
    admin: (req, res, next) => {
        if(!req.session.user || req.session.user.admin != 1) {
            return res.redirect("/user/dashboard")
        }
        return next();
    },
    user: (req, res, next) => {
        if(!req.session.user){
            return res.redirect("/login")
        }
        return next();
    },
    session: (isAdminRoute = false) => {
        return (req, res, next) => {
            if(!req.session.user){
                return res.status(401).json({ error: "Unauthorised", message: "You are not logged in." })
            }
            if(isAdminRoute && req.session.user.admin != 1){
                return res.status(403).json({ error: "Forbidden", message: "Admin permissions required." })
            }
            return next();
        }
    }
}