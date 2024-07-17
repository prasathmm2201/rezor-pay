const express = require('express')
const Razorpay = require('razorpay')
const app = express()
const bodyParser = require('body-parser');
const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');
const dotenv = require("dotenv")
dotenv.config(".env");

const key_secret = process.env.key_secret;
const key_id = process.env.key_id
// create a instance
var instance = new Razorpay({
    key_id:key_id,
    key_secret:key_secret
})

// Middleware to parse URL-encoded and JSON bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// create order
app.post('/create/order' , (req , res)=>{
    var options = {
        amount:req.body.amount,
        currency:"INR",
        receipt:"22828g2b2b2y"
    }
    instance.orders.create(options , function(err , order){
        console.log(order)
        res.send({id:order.id})
    })
})
app.post('/payment/verify' , (req , res)=>{
    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id
    var crypto = require("crypto")
    var signature = crypto.createHmac('sha256' , key_secret)
    .update(JSON.stringify(body))
    .digest('hex');

    if(signature === req.body.response.razorpay_signature){
       return res.sendFile("sucess.html" , {root:__dirname})
    }
    res.sendFile("sucess.html" , {root:__dirname})

})
app.post('error' , (req, res)=> {
    console.log(req.body)
    res.sendFile("error.html" , {root:__dirname})
})
app.get('/' , (req, res)=> {
    res.sendFile("standard.html" , {root:__dirname})
})

app.listen('3002' , ()=>{
    console.log(`server is runnig on 3002`)
})