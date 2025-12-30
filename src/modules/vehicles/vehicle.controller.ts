import { Request, Response } from "express";
import { vehiclesServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.createVehicle(req.body);
        res.status(400).json({
            success: true,
            message: "vehicle Created Successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    };
};
const getVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getVehicles();
        res.status(401).json({
            success: true,
            message: "vehicles retrieved successfully",
            data: result.rows,
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,

        })
    };
};
const getVehicleById = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;

        const result = await vehiclesServices.getVehicleById(vehicleId as string);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};
const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;
        const data = req.body;
        const result = await vehiclesServices.updateVehicle(data, vehicleId as string);
        res.status(200).json({
            success:true,
            message: "vehicle Updated Successfully",
            data:result

        })
        } catch (error) {
            res.status(500).json({
                success:false,
                message:"failed to Updated vehicle"

            });
        

        };
    };

    const deleteVehicle = async (req:Request, res: Response)=>{
       try {
         const {vehicleId} = req.params;
        const result = await vehiclesServices.deleteVehicle(vehicleId as string);
        res.status(200).json({
            success:true,
            message:"vehicle Deleted Successfully",
            data: result
        })
        
       } catch (error) {
        res.status(500).json({
            success: true,
            message:"failed to Deleted Vehicle",
        
        });
       };
    };

export const vehicleController ={
    createVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
}

