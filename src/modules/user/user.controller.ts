import { Request, Response } from "express";
import { userServices } from "./user.service";

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,

        })


    }
};
const getSingle = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const result = await userServices.getSingle(userId as string);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "users not found",

            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "user fat successfully",
                data: result.rows[0],
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};
const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const data = req.body;
  const loggedInUser = (req as any).user;
  if (
    loggedInUser.role === "customer" &&
    loggedInUser.id !== userId
  ) {
    return res.status(403).json({
      success: false,
      message: "You can update only your own profile",
    });
  }

  try {
    const result = await userServices.updateUser(userId as string, data);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await userServices.deleteUser(userId as string);

    
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "User has active bookings",
      });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const userControllers = {

    getUser,
    getSingle,
    updateUser,
    deleteUser,

}