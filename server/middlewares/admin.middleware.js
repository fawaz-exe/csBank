const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthenticated request"
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access only"
        });
    }

    if (!req.user.isActive) {
        return res.status(403).json({
            success: false,
            message: "Admin account is inactive"
        });
    }

    next();
};
export default adminOnly;