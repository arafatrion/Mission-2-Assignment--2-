import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import roleMiddleware from "../../middleware/role.middleware";


const router = express.Router();

router.get("/",auth(),roleMiddleware(['admin']), userControllers.getUser);

router.put("/:userId",auth(),roleMiddleware(['admin','customer']),userControllers.updateUser);

router.delete("/:userId",auth(),roleMiddleware(['admin']),userControllers.deleteUser);


export const usersRoutes = router;

