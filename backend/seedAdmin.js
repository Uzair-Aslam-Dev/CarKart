const bcrypt = require('bcrypt');
const db = require('./config/db');

const seedAdmin = async () => {
    const username = 'admin';
    const full_name = 'Admin';
    const email = 'admin@gmail.com';
    const password = 'admin1';
    const role = 'admin';

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
        INSERT INTO users (username, full_name, email, password, role)
        VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(query, [username, full_name, email, hashedPassword, role]);
    console.log('Admin seeded successfully');
    process.exit(0);
};

seedAdmin();