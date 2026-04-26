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


const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const query = 'SELECT user_id, password, role FROM users WHERE username = ?;';
        const [rows] = await db.query(query, [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const { user_id, password: hashedPassword, role } = rows[0];

        if (await bcrypt.compare(password, hashedPassword)) {
            req.session.user = { id: user_id, username: username, role: role };
            res.status(200).json({ message: "Logged in successfully" , role: role });
        } else {
            res.status(400).json({ message: "Invalid password entered" });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


const getme = (req , res) => {
    if(req.session.user) {
       req.sessionStore.get(req.sessionID, (err , sessionData)=> {
        if(err) {
            console.log(err);
        }

        else {
            console.log(sessionData)
        }

       })
        res.status(200).json({user: req.session.user })
    }
    else {
        res.status(401).json({message: "Not authenticated"})
    }
 }


 const logout = async (req , res)=> {
    req.session.destroy((err)=> {
        if(err){
            return res.status(500).json({message: 'Logout failed'});
        }

        res.clearCookie('connect.sid');
        res.status(200).json({message: "Logout successfull"});
    })
 }
 
 const addCar = async (req, res) => {
  try {
    console.log(req.body);

    const { brand, model, year, mileage, city, color, description, condition, status, price } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    const seller_id = req.session.user.id;
    const filenames = req.files.map(file => file.filename);

    // ✅ Use insertId instead of re-querying by description
    const [vehicleResult] = await db.query(
      `INSERT INTO vehicles (seller_id, brand, model, year, mileage, city, color, description, \`condition\`) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [seller_id, brand, model, year, mileage, city, color, description, condition]
    );

    const vehicle_id = vehicleResult.insertId;

    // ✅ Insert images one by one — avoids the VALUES ? bulk syntax issue with mysql2
    for (const filename of filenames) {
      await db.query(
        'INSERT INTO vehicle_images (vehicle_id, image_url) VALUES (?, ?)',
        [vehicle_id, filename]
      );
    }

    // Insert listing
    await db.query(
      'INSERT INTO listings (vehicle_id, price, status) VALUES (?, ?, ?)',
      [vehicle_id, price, status]
    );

    return res.status(200).json({ msg: 'Entry successful' });

  } catch (e) {
    console.error('addCar error:', e);
    return res.status(500).json({ error: e.message });
  }
}

const mylisting = async (req, res) => {
    try {
        const { id } = req.session.user;
        console.log("seller_id:", id);

        const query = `
            SELECT 
                (SELECT vi.image_url FROM vehicle_images vi WHERE vi.vehicle_id = v.vehicle_id LIMIT 1) as image_url,
                v.brand, v.model, v.mileage, l.price, l.status, l.created_at 
            FROM vehicles v 
            INNER JOIN listings l ON v.vehicle_id = l.vehicle_id 
            WHERE v.seller_id = ?
        `
        const [rows] = await db.query(query, [id]);
        console.log("rows:", rows);

        if (rows.length === 0) {
            return res.status(404).json({ msg: "No listing found" })
        }

        return res.json({ data: rows })

    } catch (e) {
        console.error('mylisting error:', e);
        return res.status(500).json({ error: e.message })
    }
}
module.exports = {sign , login , getme , logout , addCar ,mylisting};