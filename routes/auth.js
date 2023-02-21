const express = require('express')
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const User = require('../models/User')
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');



//create user using post "/api/auth/" doesn't require auth
const JWT_SECRET = "sakalaka boom boom"
router.post('/createuser', [
    body('email').isEmail(),
    body('name').isLength({ min: 2 }),
    body('password').isLength({ min: 8 }),
], async (req, res) => {
    //return errors
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    //same email cheaking
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, error: "sorry this email already exists" })
        }
        const salt = await bcrypt.genSalt(10)
        const secpass = await bcrypt.hash(req.body.password, salt)

        //creating a new user
        user = await User.create({
            name: req.body.name,
            password: secpass,
            email: req.body.email,
        });
        const data = {
            user: {
                id: user.id

            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true;
        let nam = user.name;
        res.json({ success, authtoken, nam })

    } catch (error) {
        console.log(error.message)
        // alert(error.message)
        res.status(500).send("some error has occurd")
    }

})



//authantication for user no login  post: /api/auth/login
router.post('/login', [
    body('email').isEmail(),
    body('password').exists(),
], async (req, res) => {

    let success = false

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false

            return res.status(400).json({ error: "wrong details" })
        }
        const passwordcompare = await bcrypt.compare(password, user.password)
        if (!passwordcompare) {
            success = false
            return res.status(400).json({ success, error: "wrong details" })

        }
        const data = {
            user: {
                id: user.id

            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true;
        let nam = user.name;
        res.json({ success, authtoken, nam })

    }
    catch (error) {
        // console.log(error.message)
        alert(error.message)
        res.status(500).send("internal error")

    }

})


//get loged in details

router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userid = req.user.id
        const user = await User.findById(userid).select("-passwod")
        res.send(user)
    }
    catch (error) {
        alert(error.message)
        res.status(500).send("some error has occurd")

    }
})

module.exports = router