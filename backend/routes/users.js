const express = require('express');
const validate = require('../middlewares/validate');
const isAdmin = require('../middlewares/isAdmin');
const {param , query , body, check} = require('express-validator');
const {
  sign,
  login,
  getme,
  logout,
  addCar,
  mylisting,
  sellerdashCard,
  dellisting,
  editlisting,
  resetPasswordByUsername,
  getBuyerDashboard,
  getBuyerOrders,
  getSellerOrders,
  updateSellerOrder,
  orderVehicle,
  addtoWishlist,
  getuserWishlist,
  getStats,
  getAllUsers, 
  deleteUser, 
  getAllListings, 
  toggleListingStatus, 
  getAllOrders
} = require('../controllers/usercontroller')
const validateSession  = require('../middlewares/sessionvalidate')

const upload = require('../middlewares/multerSetup')
const router = express.Router();

const checks = [
    body('username').notEmpty().withMessage('Enter a username').trim(),
    body('full_name').notEmpty().withMessage('Enter your full name').trim(),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Enter a password')
        .isLength({ min: 2, max: 24 }).withMessage('Password must be 2–24 characters'),
    body('role').notEmpty().withMessage('Select a role'),
];

const loginchecks = [ 
    body('username').notEmpty().withMessage("Enter your user name").trim(),
    body('password').notEmpty().withMessage("Enter password").isLength({min: 2 , max : 24}).withMessage("Password must be 2–24 characters")
]

const resetPasswordByUsernameChecks = [
  body('username').notEmpty().withMessage('Enter your username').trim(),
  body('newPassword')
    .notEmpty()
    .withMessage('Enter a new password')
    .isLength({ min: 2, max: 24 })
    .withMessage('Password must be 2–24 characters'),
]

router.get('/' , (req ,res )=> {
    res.status(200).send({name: 'Abdullah'});
})

router.get('/me' , validateSession, getme);
router.post('/Sign-up' , checks , validate , sign);
router.post('/login' , loginchecks , validate , login);
router.post('/logout' , logout);
router.post('/reset-password', resetPasswordByUsernameChecks, validate, resetPasswordByUsername);
router.get('/mylistings', validateSession , mylisting )
router.get('/sellerdash' , validateSession , sellerdashCard)
router.get('/seller-orders', validateSession, getSellerOrders)
router.patch('/seller-orders/:orderId', validateSession, updateSellerOrder)
router.delete('/deletelisting' , validateSession , dellisting)
router.put('/editlisting' , validateSession , editlisting)
router.get('/dashboard',validateSession,getBuyerDashboard)
router.get('/orders',validateSession,getBuyerOrders);
router.post('/orderVehicle', validateSession, orderVehicle);
router.post('/wishlist',validateSession, addtoWishlist);
router.get('/my-wishlist',validateSession, getuserWishlist);


router.post('/addvehicle' , validateSession, upload.array('vehicle_images',5), addCar );

//admin routes
router.get('/stats', isAdmin, getStats);
router.get('/users', isAdmin, getAllUsers);
router.delete('/users/:id', isAdmin, deleteUser);
router.get('/listings', isAdmin, getAllListings);
router.put('/listings/:id/toggle', isAdmin, toggleListingStatus);
router.get('/adminorders', isAdmin, getAllOrders);


module.exports = router;