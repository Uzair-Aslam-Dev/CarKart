const db = require('../config/db');
const bcrypt = require('bcrypt');
const fs =require('fs').promises;
const path = require('path')
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

    //  Use insertId instead of re-querying by description
    const [vehicleResult] = await db.query(
      `INSERT INTO vehicles (seller_id, brand, model, year, mileage, city, color, description, \`condition\`) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [seller_id, brand, model, year, mileage, city, color, description, condition]
    );

    const vehicle_id = vehicleResult.insertId;

    // Insert images one by one — avoids the VALUES ? bulk syntax issue with mysql2
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
            SELECT l.listing_id , v.vehicle_id,
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

const sellerdashCard = async ( req , res) => {
    const { id} = req.session.user;

    const query = 'select count(*) as count from vehicles where seller_id = ? ;'
    const [rows] = await db.query(query , [id]);
    console.log("Total cars listed")
        console.log(rows[0]);
        const data = {count : rows[0].count};
    
        const query2 = 'select count(*) as soldc  from vehicles v inner join listings l on v.vehicle_id = l.vehicle_id where v.seller_id = ? and l.status = "sold" ;'
        const [rows2] = await db.query(query2,[id]);

        data.soldc = rows2[0].soldc;


       
        const query3 = 'select count(*) as pendc from vehicles v inner join listings l on v.vehicle_id = l.vehicle_id inner join orders o on o.listing_id = l.listing_id where v.seller_id = ? and o.status="pending"; '

        const [rows3] = await db.query(query3,[id]); 
        data.pendc = rows3[0].pendc;
        console.log(data);


        res.json({data});
} 

const dellisting = async (req, res) => {
  const { id } = req.session.user
  const { listingid, vehicleid } = req.body

  try {
    
    const [images] = await db.query(
      'SELECT image_url FROM vehicle_images WHERE vehicle_id = ?',
      [vehicleid]
    )

    
    for (const item of images) {
      const filepath = path.join(__dirname, '..' ,'uploads', item.image_url)
      try {
        await fs.unlink(filepath)
        console.log(`Deleted file: ${item.image_url}`)
      } catch (e) {
        console.error(`Failed to delete file: ${item.image_url}`, e)
      }
    }

  
    await db.query('DELETE FROM vehicle_images WHERE vehicle_id = ?', [vehicleid])
    await db.query('DELETE FROM listings WHERE listing_id = ?', [listingid])
    await db.query('DELETE FROM vehicles WHERE vehicle_id = ?', [vehicleid])
    

    res.status(200).json({ msg: "Successful" })
  } catch (e) {
    console.error(e)
    res.status(500).json({ err: e.message })
  }
}

const editlisting = async (req, res) => {
  const sellerId = req.session.user.id
  const { listingid, vehicleid, brand, model, mileage, price, status } = req.body

  if (!listingid || !vehicleid) {
    return res.status(400).json({ message: 'Listing and vehicle IDs are required.' })
  }

  if (!brand || !model) {
    return res.status(400).json({ message: 'Brand and model are required.' })
  }

  const parsedMileage = Number(mileage)
  const parsedPrice = Number(price)
  const normalizedStatus = String(status || '').toLowerCase()
  const allowedStatuses = ['active', 'inactive', 'sold']

  if (Number.isNaN(parsedMileage) || parsedMileage < 0) {
    return res.status(400).json({ message: 'Mileage must be a valid non-negative number.' })
  }

  if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
    return res.status(400).json({ message: 'Price must be a valid number greater than zero.' })
  }

  if (!allowedStatuses.includes(normalizedStatus)) {
    return res.status(400).json({ message: 'Invalid status value.' })
  }

  try {
    const [ownedVehicle] = await db.query(
      'SELECT vehicle_id FROM vehicles WHERE vehicle_id = ? AND seller_id = ?',
      [vehicleid, sellerId]
    )

    if (ownedVehicle.length === 0) {
      return res.status(403).json({ message: 'You are not allowed to edit this listing.' })
    }

    const [ownedListing] = await db.query(
      'SELECT listing_id FROM listings WHERE listing_id = ? AND vehicle_id = ?',
      [listingid, vehicleid]
    )

    if (ownedListing.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' })
    }

    await db.query(
      'UPDATE vehicles SET brand = ?, model = ?, mileage = ? WHERE vehicle_id = ?',
      [brand.trim(), model.trim(), parsedMileage, vehicleid]
    )

    await db.query(
      'UPDATE listings SET price = ?, status = ? WHERE listing_id = ?',
      [parsedPrice, normalizedStatus, listingid]
    )

    return res.status(200).json({ message: 'Listing updated successfully.' })
  } catch (e) {
    console.error('editlisting error:', e)
    return res.status(500).json({ message: 'Failed to update listing.', error: e.message })
  }
}

const getBuyerDashboard = async (req,res) => {
    const id = req.session.user.id;
    try{
        const [orders] = await db.query(
            `SELECT 
            o.order_id,
            o.total_price,
            o.status,
            o.created_at,
            v.brand,
            v.model,
            v.year,
            (SELECT vi.image_url FROM vehicle_images vi WHERE vi.vehicle_id = v.vehicle_id LIMIT 1) as image_url
            FROM orders o
            JOIN listings l ON o.listing_id = l.listing_id
            JOIN vehicles v ON l.vehicle_id = v.vehicle_id
            WHERE o.buyer_id = ?
            ORDER BY o.created_at DESC
            LIMIT 5`,
            [id]
        )
        
        const [statsRows] = await db.query(
            `SELECT
            COUNT(*) as total_orders,
            SUM(CASE WHEN status = 'pending'   THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as approved,
            SUM(total_price) as total_spent
            FROM orders
            WHERE buyer_id = ?`,
            [id]
        )

        const stats = statsRows[0] || {
            total_orders: 0,
            pending: 0,
            completed: 0,
            approved: 0,
            total_spent: 0
        };

        res.json({orders,stats});
    }
    catch(err){
        console.error('getBuyerDashboard error:', err)
        res.status(500).json({ message: 'Server error' })
    }
} 


const getBuyerOrders = async (req,res) => {
    const id =  req.session.user.id;
    try{
        const [orders] = await db.query(
            `Select order_id,total_price,status,created_at
            From orders 
            where buyer_id = ?
            Order by created_at DESC`,
            [id]
        )

        res.json({orders});
    }
    catch(err){
        console.error('getBuyerOrder Error:',err);
        res.status(500).json({message: 'Server Eror'})
    }
}

const orderVehicle = async (req,res) => {
    try{
        const buyer_id = req.session.user.id;
        const {listingid} = req.body;

        const [rows] = await db.query(`
            SELECT l.price, l.status, v.seller_id
            FROM listings l
            JOIN vehicles v ON l.vehicle_id = v.vehicle_id
            WHERE l.listing_id = ?
        `, [listingid])

        const listing = rows[0]

    const [existing] = await db.query(
      'SELECT order_id FROM orders WHERE listing_id = ?',
      [listingid]
    )

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Vehicle already ordered' })
    }

    const [result] = await db.query(`
      INSERT INTO orders (buyer_id, listing_id, total_price)
      VALUES (?, ?, ?)
    `, [buyer_id, listingid, listing.price])

    const order_id = result.insertId

    await db.query(`
      INSERT INTO order_history (order_id, status)
      VALUES (?, 'pending')
    `, [order_id])

    await db.query(`
      UPDATE listings
      SET status = 'sold'
      WHERE listing_id = ?
    `, [listingid])

    res.status(201).json({
      message: 'Order placed successfully',
      order_id,
      status: 'pending', 
    })

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' })
    }
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Failed to place order'});
    }
}

const addtoWishlist = async (req, res) => {
    const id = req.session.user?.id;
    const { listing_id } = req.body;

    if (!id) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    if (!listing_id) {
        return res.status(400).json({ error: 'Listing ID is required.' });
    }

    try {
        const [existing] = await db.query(
            'SELECT * FROM wishlist WHERE user_id = ? AND listing_id = ?',
            [id, listing_id]
        );

        if (existing.length > 0) {
            await db.query(
                'DELETE FROM wishlist WHERE user_id = ? AND listing_id = ?',
                [id, listing_id]
            );
            return res.status(200).json({ 
                message: 'Removed from wishlist', 
                isWishlisted: false 
            });
        } else {
            await db.query(
                'INSERT INTO wishlist (user_id, listing_id) VALUES (?, ?)',
                [id, listing_id]
            );
            return res.status(201).json({ 
                message: 'Added to wishlist', 
                isWishlisted: true 
            });
        }
    } catch (error) {
        console.error('Wishlist DB Error:', error);
        return res.status(500).json({ error: 'Database error occurred.' });
    }
};

const getuserWishlist = async (req,res) => {
    const id = req.session.user.id;

    try{
        const [items] = await db.query(
            `SELECT 
                w.wishlist_id,
                w.listing_id,
                v.vehicle_id,
                v.brand,
                v.model,
                v.year,
                v.city,
                l.price,
                (SELECT image_url FROM vehicle_images WHERE vehicle_id = v.vehicle_id LIMIT 1) as image_url
            FROM wishlist w
            JOIN listings l ON w.listing_id = l.listing_id
            JOIN vehicles v ON l.vehicle_id = v.vehicle_id
            WHERE w.user_id = ?
            ORDER BY w.created_at DESC`,
            [id]
        );

        res.status(200).json(items);
    }
    catch(err){
        console.log('Fetch Wishlist Error:',err);
        res.status(500).json({ error: 'Failed to retrieve wishlist items.' });
    }
     
}

module.exports = {sign , login , getme , logout , addCar ,mylisting , sellerdashCard , dellisting, editlisting, getBuyerDashboard, getBuyerOrders, orderVehicle, addtoWishlist, getuserWishlist};