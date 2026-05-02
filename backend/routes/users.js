const express = require('express');
const validate = require('../middlewares/validate');
const {param , query , body, check} = require('express-validator');
const {sign , login , getme , logout , addCar , mylisting , sellerdashCard} = require('../controllers/usercontroller')
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

router.get('/' , (req ,res )=> {
    res.status(200).send({name: 'Abdullah'});
})

router.get('/me' , validateSession, getme);
router.post('/Sign-up' , checks , validate , sign);
router.post('/login' , loginchecks , validate , login);
router.post('/logout' , logout);
router.get('/mylistings', validateSession , mylisting )
router.get('/sellerdash' , validateSession , sellerdashCard)

router.post('/addvehicle' , validateSession, upload.array('vehicle_images',5), addCar );
module.exports = router;