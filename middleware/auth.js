import { ROLES } from "../services/Roles.js";
import jwt from "jsonwebtoken"


export function authUser(req, res, next) {
  const header = req.headers["authorization"];
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "missing or invalid Authorization header" });
  }

  const token = header.slice(7); // remove "Bearer "

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach user info to req for later use
    req.user = {
      id: payload._id,   // or payload.id if you switched to custom claim
      role: payload.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "invalid or expired token" });
  }
}
/** 
* Extra middleware factory: require specific roles.
* Usage: router.get("/admin", authUser, requireRole("ADMIN"), handler)
*/
export function requireRole(...roles) {
 return (req, res, next) => {
   if (!req.user) {
     return res.status(401).json({ message: "not authenticated" });
   }
   if (!roles.includes(req.user.role)) {
     return res.status(403).json({ message: "forbidden: insufficient role" });
   }
   next();
 };
}