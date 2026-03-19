const express = require('express');
const validate = require('../middlewares/validate');
const {param , query , body, check} = require('express-validator');
const {sign} = require('../controllers/usercontroller')
const router = express.Router();

const checks = [
    body('username').notEmpty().withMessage('Enter a username').trim(),
    body('full_name').notEmpty().withMessage('Enter your full name').trim(),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Enter a password')
        .isLength({ min: 2, max: 24 }).withMessage('Password must be 6–24 characters'),
    body('role').notEmpty().withMessage('Select a role'),
];


router.get('/' , (req ,res )=> {
    
    res.status(200).send({name: 'Abdullah'});
})


router.post('/Sign-up' , checks , validate , sign)
module.exports = router;