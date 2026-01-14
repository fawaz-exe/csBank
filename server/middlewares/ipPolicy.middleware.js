import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";

export const ipPolicyMiddleware = async (req, res, next) => {
    try {
        const clientIp = req.socket.remoteAddress;
        const userRole = req.user.role;

        const admin = await Admin.findOne({});
        // const admin = await Admin.findOne({ status: "active" });

        if (!admin || !admin.ipPolicies.length) {
            return next(); // no policies, move forward
        }

        const policy = admin.ipPolicies.find(
            p => p.ipAddress === clientIp && p.isActive
        );

        if (!policy) return next();

        if (policy.blockedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `${userRole} access blocked from this IP`
            });
        }

        if (policy.allowedRoles.length && !policy.allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Role not allowed from this IP"
            });
        }

        if (!policy.isTrusted && policy.maxUsers) {
            const activeUsers = await User.countDocuments({
                lastLogin: { $gte: new Date(Date.now() - 15 * 60 * 1000) }
            });

            if (activeUsers >= policy.maxUsers) {
                return res.status(429).json({
                    success: false,
                    message: "Too many users from this IP"
                });
            }
        }

        next();

    } catch (error) {
        console.error("ipPolicyMiddleware error:", error);
        res.status(500).json({
            success: false,
            message: "IP policy enforcement failed"
        });
    }
};
export default ipPolicyMiddleware;