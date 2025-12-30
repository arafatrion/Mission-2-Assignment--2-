import { NextFunction, Request, Response } from "express"

const roleMiddleware = (roles:string[]) =>{
    return (req : Request, res: Response, next:NextFunction) =>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:'Forbidden'});
        }
        next();
    };
};
export default roleMiddleware;