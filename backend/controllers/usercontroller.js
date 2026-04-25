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
        res.status(200).json({user: req.session.user})
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
 
 const addCar = async (req , res)=> {
    try {
        console.log(req.body);
    const { brand , model , year ,  mileage , city , color , description , condition ,status , price }   = req.body;
    if(!req.files || req.files.length == 0) {
        return res.status(400).json({error : 'Atleasst one image is required'});
    }
    const seller_id = req.session.user.id;
    const filenames = req.files.map(file => file.filename);
   const query = `INSERT INTO vehicles(seller_id, brand, model, year, mileage, city, color, description, \`condition\` ) 
               VALUES (?,?,?,?,?,?,?,?,?);`;

    await db.query(query, [seller_id, brand, model, year, mileage, city, color, description, condition]);

    const query2 = 'select vehicle_id from vehicles where description = ? and seller_id= ? ;'
    const [rows] = await db.query(query2,[description , seller_id]);

    if(rows.length == 0) {
        return res.status(400).json({error : 'Erro while inserting into db'});
    }

    const {vehicle_id} = rows[0];
        const imageValues = filenames.map(filename => [vehicle_id, filename]);
        const query3 = 'INSERT INTO vehicle_images(vehicle_id, image_url) VALUES ?';
        await db.query(query3, [imageValues]);

        const query4 = 'insert into listings(vehicle_id , price , status) values (?,?,?);'
        await db.query(query4 , [vehicle_id ,price,status])

        return res.status(200).json({ msg: 'Entry successful' });

    } catch (e) {
        console.error('addCar error:', e);
        return res.status(500).json({ error: e.message });
    }
 }
module.exports = {sign , login , getme , logout , addCar};