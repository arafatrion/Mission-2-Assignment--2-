import express, { NextFunction, Request, Response } from "express";
import logger from "./middleware/logger";
import initDB, { pool } from "./config/db";
import { usersRoutes } from "./modules/user/user.routes";
import { authRouter } from "./auth/auth.routes";
import { vehicleRouter } from "./modules/vehicles/vehicle.routes";
import { bookingRouter } from "./modules/booking/booking.routes";


const app = express()



//  parser 
app.use(express.json());

//  initializing DB
initDB();


app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello Next level wed developers!')
});

// User CURD operation
app.use("/api/v1/users",usersRoutes);
app.use("/api/v1/vehicles",vehicleRouter);
app.use("/api/v1/bookings",bookingRouter);

// auth Routes
app.use("/api/v1/auth",authRouter);

// middle Ware 
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    })
});


export default app;



