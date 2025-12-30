import { Router } from "express";
import auth from "../../middleware/auth";
import roleMiddleware from "../../middleware/role.middleware";
import { vehicleController } from "./vehicle.controller";

const router = Router();

router.post("/",auth(),roleMiddleware(['admin']),vehicleController.createVehicle);
router.get("/",vehicleController.getVehicles);
router.get("/:vehicleId",vehicleController.getVehicleById);
router.put("/:vehicleId",auth(),roleMiddleware(['admin']),vehicleController.updateVehicle);
router.delete("/:vehicleId",auth(),roleMiddleware(['admin']),vehicleController.deleteVehicle);


export const vehicleRouter = router;