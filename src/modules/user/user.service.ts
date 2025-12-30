import { pool } from "../../config/db";


const getUser = async () => {
    const result = await pool.query(`SELECT id,name,email,phone,role FROM users`);
    return result;
};
const getSingle = async (userId : string) => {
    const result = await pool.query(`SELECT id,name,email,phone,role FROM users WHERE id=$1`,
        [userId]);
    return result;
};
const updateUser = async (userId: string, data: any) => {
  const result = await pool.query(
    `UPDATE users 
     SET name = $1, phone = $2, role = $3 
     WHERE id = $4 
     RETURNING id, name, email, phone, role`,
    [data.name, data.phone, data.role, userId]
  );
  return result;
};


const updateOwnProfile = async (userId: string, data: any) => {
  const result = await pool.query(
    `UPDATE users 
     SET name = $1, phone = $2 
     WHERE id = $3 
     RETURNING id, name, email, phone, role`,
    [data.name, data.phone, userId]
  );
  return result;
};


const deleteUser = async (userId: string) => {

  const bookingResult = await pool.query(
    `SELECT 1 FROM bookings WHERE user_id = $1 AND status = 'active'`,
    [userId]
  );

  if (( bookingResult.rowCount ?? 0) > 0) {
    return null;
  }

  
  const deleteResult = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id, name, email`,
    [userId]
  );

  return deleteResult;
};


    

export const userServices = {
    
    getUser,
    getSingle,
    updateUser,
    updateOwnProfile,
    deleteUser,
}