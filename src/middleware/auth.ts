

import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles : string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            console.log({ authToken: token });
            if (!token) {
                return res.status(401).json({ message: "You are not allowed!" })
            }
            const decode = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
            console.log({ decode });
            req.user = decode ;

            
           if(roles.length && !roles.includes(decode.role as string )){
             return res.status(403).json({
                error : "Unauthorized !!",
             });
           }


            next();
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message

            });

        }
    };
};

export default auth;
