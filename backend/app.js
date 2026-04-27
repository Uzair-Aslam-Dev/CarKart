const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');  


const router  = require('./routes/index');

const app = express();



app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({secret : 'vehicle_marketplace' , resave : false , saveUninitialized : false , cookie : {maxAge : 60*60* 1000 , httpOnly : true , secure : false  , sameSite: 'lax'}}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(router);





const port = process.env.PORT || 5000;

app.get("/",(req , res)=>{
    console.log("Welcome to home page");
    res.send("Welcome to homepage");
});


//fetching vehicles to show to the buyer
app.get('/vehicles', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        v.vehicle_id AS id,
        CONCAT(v.brand, ' ', v.model) AS title,
        v.year,
        v.mileage,
        l.price,
        l.listing_id,
        (SELECT vi.image_url 
         FROM vehicle_images vi 
         WHERE vi.vehicle_id = v.vehicle_id 
         LIMIT 1
        ) AS image
      FROM vehicles v
      JOIN listings l ON l.vehicle_id = v.vehicle_id
      WHERE l.status = 'active'
    `)

    res.json(rows)

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})



//getting specific car details for displaying
app.get("/api/vehicles/:id", async (req, res) => {
  const listingId = req.params.id;

  try {
    const [rows] = await db.execute(
      `SELECT
        v.vehicle_id,
        v.brand,
        v.model,
        v.year,
        v.mileage,
        v.city,
        v.color,
        v.description,
        v.condition,
        l.status        AS vehicle_status,
        l.listing_id,
        l.price,
        l.status        AS listing_status,
        l.created_at,
        u.full_name     AS seller_name,
        u.phone         AS seller_phone,
        u.city          AS seller_city,
        u.email         AS seller_email
      FROM listings l
      JOIN vehicles v ON v.vehicle_id = l.vehicle_id
      JOIN users u    ON u.user_id    = v.seller_id
      WHERE l.listing_id = ?`,
      [listingId]
    );
    console.log(rows[0]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const vehicle = rows[0];

    // Fetch all images for this vehicle
    const [imageRows] = await db.execute(
      `SELECT image_url FROM vehicle_images WHERE vehicle_id = ?`,
      [vehicle.vehicle_id]
    );

    vehicle.images = imageRows.map((r) => r.image_url);

    res.json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



const db = require('./config/db');

db.query('SELECT 1')
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.log('Database connection failed:', err.message));

module.exports=app;