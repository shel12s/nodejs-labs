export function authOnly(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

export function adminOnly(req, res, next) {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).send("Доступ заборонено");
    }
    next();
}

export function guestOnly(req, res, next) {
    if (req.session.user) {
        return res.redirect("/dashboard");
    }
    next();
}
