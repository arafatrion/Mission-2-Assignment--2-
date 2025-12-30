import { Pool } from "pg";
import config from ".";

// database 
 export const pool = new Pool({
    connectionString:`${config.connection_str}`,
});


const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email TEXT UNIQUE NOT NULL
        CHECK (email = LOWER(email)),
        password TEXT NOT NULL
        CHECK(LENGTH(password) > 6),
        phone VARCHAR(15),
        role TEXT CHECK (role IN 
        ('admin', 'customer')) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
    await pool.query(`
            CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name TEXT NOT NULL,
            type TEXT CHECK (type IN
            ('car','bike','van','SUV')),
            registration_number TEXT UNIQUE NOT NULL,
            daily_rent_price NUMERIC NOT NULL
            CHECK (daily_rent_price > 0),
            availability_status TEXT CHECK (availability_status IN 
            ('available','booked')) DEFAULT 'available',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            
            )`);
            await pool.query(`
                CREATE TABLE IF NOT EXISTS bookings(
                id SERIAL  PRIMARY KEY,
                customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
                rent_start_date DATE NOT NULL,
                rent_end_date DATE NOT NULL 
                CHECK ( rent_end_date > rent_start_date),
                total_price NUMERIC NOT NULL,
                status TEXT CHECK (status IN 
                ('active','cancelled','returned')) DEFAULT 'active'

                )`);
};

export default initDB;