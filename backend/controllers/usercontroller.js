const db = require('../config/db');
const bcrypt = require('bcrypt');

const sign = async (req, res) => {
    
    try {
        const { body } = req;
        console.log(body)
        const { username, full_name, email, password, city, phone, role } = body;
        const hashedpassword = await bcrypt.hash(password , 10);
        const query = `
            INSERT INTO users 
            (username, full_name, email, password, phone, city, role) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        await db.query(query, [
            username,
            full_name,
            email,
            hashedpassword,
            phone,
            city,
            role
        ]);

       res.status(201).json({ message: "User added successfully" });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
}
};















module.exports = {sign};