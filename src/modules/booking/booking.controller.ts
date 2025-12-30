import { Request, Response } from "express";
import { bookingService } from "./booking.service";



const createBooking = async (req: Request, res: Response) => {
  const userId = req.user.id; 
  const data = req.body;
  const result = await bookingService.createBooking(data, userId);
  res.status(result.success ? 200 : 400).json(result);
};

 const getBookings = async (req: Request, res: Response) => {
  const role = req.user.role;
  const userId = req.user.id;

  let bookings;
  if (role === "admin") {
    bookings = await bookingService.getAllBookings();
  } else {
    bookings = await bookingService.getUserBookings(userId);
  }
  res.json({
     success: true,
      data: bookings
     });
};


 const cancelBooking = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { bookingId } = req.params;

  const result = await bookingService.cancelBooking(bookingId as string, userId);
  res.status(result.success ? 200 : 400).json(result);
};


const markReturned = async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  const result = await bookingService.markBookingReturned(bookingId as string);
  res.status(result.success ? 200 : 400).json(result);
};
 export const bookingController = {
 createBooking,
 getBookings,
 cancelBooking,
 markReturned
 };
