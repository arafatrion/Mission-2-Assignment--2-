import { Router } from "express";
import auth from "../../middleware/auth";
import roleMiddleware from "../../middleware/role.middleware";
import { bookingController } from "./booking.controller";


const router = Router();


router.post("/",auth(),roleMiddleware(['admin','customer']),bookingController.createBooking);
router.get("/",auth(),roleMiddleware(['admin','customer']),bookingController.getBookings);
router.put("/:bookingId",auth(),roleMiddleware(['admin']),bookingController.cancelBooking);
router.put("/:bookingId",auth(),roleMiddleware(['admin']),bookingController.markReturned);


export const bookingRouter = router;