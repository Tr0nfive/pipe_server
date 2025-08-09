import rateLimit from "express-rate-limit";

export  const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true ,
    legacyHeaders: false ,
    keyGenerator : function (req) {
        return req.ip;
    },
    message : "You piss of sh#t , hacker . Gatcha motherf#cker"
})                                                                      