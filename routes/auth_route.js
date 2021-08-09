const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const Email = require('email-templates');

///////////// nodemailer configuration ///////////////
var transporter = nodemailer.createTransport({
    host: 'email host address', // mail.testmail.com
    port: 587,
    auth: {
      user: 'email username', // mail@testmail.com
      pass: process.env.MAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
  });

//////////////// Template ////////////////
const email = new Email({
    transport: transporter,
    send: true,
    preview: false,
  });

// create random string for verification code
const randString = () => {
    const len = 5;
    let randStr = '';
    for(let i=0 ;i<len;i++){
        const ch = Math.floor((Math.random()*10)+1);
        randStr +=ch;
    }
    return randStr;
};

// register
router.post('/register', async (req,res) => {

    // check if mail exists
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist)
        return res.status(409).send('Email already exists');//409 = conflict
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    // Create a new User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    // create uniqueString
    user.uniqueString = randString();

    try {
        const savedUser = await user.save();
        // console.log('unique String is '+user.uniqueString);

        // send email with template
        email.send({
            template: 'hello',
            message: {
                from: 'یادداشت <noreply@test.com>',
                to: user.email,
            },
            locals: {
                fname: user.name,
                fcode: user.uniqueString,
            }
            })
            .then(() => {
                console.log('email has been sent!');
            })
            .catch(err => {
                res.status(404).send('failed');
            });

        user.uniqueString = '';
        res.status(201).send(user); //201 = created
    } catch (error) {
        res.status(400).send(error); //400 = bad request
    }
});

// Login
router.post('/login', async (req,res) => {
    // check if user exists
    const user = await User.findOne({email: req.body.email});
    if(!user) 
        return res.status(401).send('Email or Password is wrong'); 

    // is password correct 
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) 
        return res.status(401).send('Email or Password is wrong');

    // user is not verified
    if(!user.isValid){
        ///send verification code email first////
        //
        //
        return res.status(403).send('Verify your email');
    }

    // Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

    // res.header('auth-token', token).send(token);
    res.status(200).header('auth-token', token).send(user);

    // res.status(200).header('auth-token', token).json({'token': token});
});

// resend verification code
router.post('/resendcode',async (req,res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) 
        return res.status(401).send();///user does not exist
    
    const uinqestr = randString();
    const updateUser = await User.updateOne({email: req.body.email},{
        $set: {
            uniqueString: uinqestr
        }
    })
    .then(result => {
        // console.log("update verify");
        // console.log('unique String is '+uinqestr);

        ////////////////////////////////////
        email.send({
            template: 'hello',
            message: {
                from: 'یادداشت <noreply@test.com>',
                to: user.email,
            },
            locals: {
                fname: user.name,
                fcode: user.uniqueString,
            }
            })
            .then(() => {
                console.log('email has been sent!');
            })
            .catch(err => {
                res.status(404).send('failed');
            });
        ////////////////////////////////////

        res.status(200).send(result);
    })
    .catch(err => {
        res.status(400).send();
        console.log(err);
    });
    
});

// Verify user By verification code
router.post('/verify',async (req,res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) 
        return res.status(401).send();///user does not exist

    
    if(user.uniqueString == req.body.uniqueString){
        const updateUser = await User.updateOne({email: req.body.email},{
            $set: {
                isValid: true
            }
        })
        .then(result => {
            console.log("update verify");
            res.status(200).send(result);
        })
        .catch(err => {
            res.status(400).send();
            console.log(err);
        });
    } else{
        res.status(406).send('verification code is wrong');///
    }
});
 


module.exports = router;