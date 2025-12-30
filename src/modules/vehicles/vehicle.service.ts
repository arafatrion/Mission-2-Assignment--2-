import { pool } from "../../config/db";

const createVehicle = async (data: any) => {
    const result = await pool.query(
        `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
         VALUES($1, $2, $3, $4, $5)
         RETURNING *`,
        [
            data.vehicle_name,
            data.type,
            data.registration_number,
            data.daily_rent_price,
            data.availability_status || 'available'
        ]
    );
    return result.rows[0]; 
};

const getVehicles = async () => {
    const result = await pool.query(`SELECT * FROM vehicles `);
    return result.rows[0];
};

const getVehicleById = async (vehicleId: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
    return result.rows[0];
};

const updateVehicle = async (data: any, vehicleId: string) => {
    const result = await pool.query(
        `UPDATE vehicles 
         SET vehicle_name = $1, type = $2, daily_rent_price = $3, availability_status = $4 
         WHERE id = $5
         RETURNING *`,
        [
            data.vehicle_name,
            data.type,
            data.daily_rent_price,
            data.availability_status,
            vehicleId
        ]
    );
    return result.rows[0];
};

const hasActiveBooking = async (vehicleId: string) => {
    const result = await pool.query(
        `SELECT 1 FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
        [vehicleId]
    );
    return (result.rowCount ??0) > 0;
};

const deleteVehicle = async (vehicleId: string) => {
    const activeBooking = await hasActiveBooking(vehicleId);

    if (activeBooking) {
        throw new Error('Cannot delete vehicle: active booking exists');
    }

    const result = await pool.query(
        'DELETE FROM vehicles WHERE id = $1 RETURNING *',
        [vehicleId]
    );

    return result.rows[0]; 
};

export const vehiclesServices = {
    createVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};
