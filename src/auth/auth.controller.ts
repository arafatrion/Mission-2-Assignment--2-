import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const token = await authServices.signIn(email, password)
        res.status(200).json({ token })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};
const signUp = async (req: Request, res: Response) => {
    try {
        const result = await authServices.signUp(req.body);
        if (!result) {
            return res.status(400).json({ success: false, message: "Unable to create user" });
        }
        res.status(201).json({ success: true, token: result.token, user: result.user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const authController = {
    signIn,
   signUp
}
