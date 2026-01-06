import { pool } from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";


const signUp = async (data: any) => {

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);


    const result = await pool.query(
        `INSERT INTO users (name, email, password, phone, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, role`,
        [data.name, data.email, hashedPassword, data.phone, data.role || "customer"]
    );

    if (result.rows.length === 0) return null;

    const user = result.rows[0];


    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        config.jwtSecret as string,
        { expiresIn: "7d" }
    );

    return { token, user };
};


const signIn = async (email: string, password: string) => {

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) return null;

    const user = result.rows[0];


    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;


    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        config.jwtSecret as string,
        { expiresIn: "7d" }
    );

   const { password:_, ...safeUser } = user;

return { token, user: safeUser };

};


export const authServices = {
    signUp,
    signIn
};
