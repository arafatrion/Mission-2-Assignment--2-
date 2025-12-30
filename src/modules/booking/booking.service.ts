import { pool } from "../../config/db";


 const createBooking = async (data: any, userId: string) => {
 
  const vehicleCheck = await pool.query(
    `SELECT availability_status, daily_rent_price FROM vehicles WHERE id = $1`,
    [data.vehicleId]
  );

  if (vehicleCheck.rowCount === 0) {
    return {
         success: false, 
         message: "Vehicle not found"
         };
  }

  const vehicle = vehicleCheck.rows[0];

  if (vehicle.availability_status !== "available") {
    return { success: false, message: "Vehicle not available" };
  }

  // Calculate total price
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const duration = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = vehicle.daily_rent_price * duration;

  // Insert booking
  const result = await pool.query(
    `INSERT INTO bookings (user_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`,
    [userId, data.vehicleId, startDate, endDate, totalPrice]
  );

 
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [data.vehicleId]
  );

  return {
     success: true, 
     data: result.rows[0]
     };
};

 const getAllBookings = async () => {
  const result = await pool.query(`SELECT * FROM bookings`);
  return result.rows;
};

 const getUserBookings = async (userId: string) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
};

 const cancelBooking = async (bookingId: string, userId: string) => {
  const result = await pool.query(
    `SELECT rent_start_date, vehicle_id FROM bookings
     WHERE id = $1 AND user_id = $2 AND status = 'active'`,
    [bookingId, userId]
  );

  if (result.rowCount === 0) {
    return { success: false, message: "Booking not found or not active" };
  }

  const startDate = new Date(result.rows[0].rent_start_date);
  if (new Date() >= startDate) {
    return { success: false, message: "Cannot cancel after start date" };
  }

  const vehicleId = result.rows[0].vehicle_id;

  await pool.query(
    `UPDATE bookings SET status = 'cancelled' WHERE id = $1`,
    [bookingId]
  );

  
  await pool.query(
    `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
    [vehicleId]
  );

  return { success: true, message: "Booking cancelled successfully" };
};

 const markBookingReturned = async (bookingId: string) => {
  const result = await pool.query(
    `SELECT vehicle_id FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (result.rowCount === 0) {
    return {
         success: false,
          message: "Booking not found"
         };
  }

  const vehicleId = result.rows[0].vehicle_id;

  await pool.query(
    `UPDATE bookings SET status = 'returned' WHERE id = $1`,
    [bookingId]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
    [vehicleId]
  );

  return {
     success:true,
     message:"Booking marked as returned"
     };
};

export const bookingService = {
    createBooking,
    getAllBookings,
    getUserBookings,
    cancelBooking,
    markBookingReturned
};
