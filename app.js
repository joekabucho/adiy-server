const express = require('express');
const request = require ('request');
const bodyParser = require('body-parser');
const timestamp = require('time-stamp');
const cors = require('cors');



const app =express();
app.use(bodyParser.json());

app.use(cors());

app.get('/',(req,res)=>{
    res.send("Youre home .Welcome")

});

app.get('/access_token',access,(req,res)=>{

res.status(200).json({access_token:req.access_token})
});

app.get("/register",access,(req,resp)=>{

    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    let auth = "Bearer " + req.access_token

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "ShortCode": "150839",
                "ResponseType": "Complete",
                "ConfirmationURL": "http://102.5.140.254:6001/confirmation",
                "ValidationURL": "http://102.5.140.254:6001/validation"
            }
        },
        function (error, response, body) {
            if (error) { console.log(error) }
            resp.status(200).json(body)
        }
    )
});



app.post('/confirmation', (req, res) => {
    console.log('....................... confirmation .............');
    console.log(req.body)
});

app.post('/validation', (req, res) => {
    console.log('....................... validation .............');
    console.log(req.body)
});

app.get('/simulate', access, (req, res) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
    let auth = "Bearer " + req.access_token;

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "ShortCode": "150839",
                "CommandID": "CustomerPayBillOnline",
                "Amount": "100",
                "Msisdn": "254708374149",
                "BillRefNumber": "TestAPI"
            }
        },
        function (error, response, body) {
            if (error) {
                console.log(error)
            }
            else {
                res.status(200).json(body)
            }
        }
    )
});

//balance
app.get('/balance',access,(req,res)=> {

    let endpoint="https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query";
    let auth = "Bearer " + req.access_token;



    request({
        url: endpoint,
        method: "POST",

        headers:{
            "Authorization": auth
        },
        json: {
            "Initiator":"apitest464",
            "SecurityCredential":"WUbAmVqY9eoXkXIQbvq+OdLUYGesnWPJ5rT4KbzN3l6whpkibGx+N6jLapvPnkM3tbVfe8gyaa6hcrfCTP/3n9Vy6zGTiKQSrfmDBTBcg8ana21h9BMn5mEYAYg6e3u2NzSI+JUWKzxxD8XoBOIH8onWhb/qkuPiM4alzb0KZdVHt4BKAfihhUwuQAix6zixQctcieMIMAFxMVhvZicWwVkADlIrH+STpIKVmbGgwpB21fydyLiGx2vONFwIKGvU94lK6AwGOfVxV+LGM6xEQg2hRDsIZuGBy49pI2lF8og2OpdrJ+ohm49aLOpRwRHJMl4essaF8KVN5VG2oxR6Qw==",
            "CommandID":"AccountBalance",
            "PartyA":"601464",
            "IdentifierType":"4",
            "Remarks":"Remarks",
            "QueueTimeOutURL":"http://102.5.140.254:6001/timeout_url",
            "ResultURL":"http://102.5.140.254:6001/result_url"
        }
    },
        function (error, response, body) {
            if (error) {
                console.log(error)
            }
            else {
                res.status(200).json(body)
            }
        }

    )
});

app.post("/timeout_url",(req,resp)=>{
    console.log('.......................  Balance Timeout Response .............');
    console.log(req.body);
});

app.post("/result_url",(req,resp)=>{
    console.log('.......................  Balance Response .............');
    console.log(req.body.Result.ResultParameters);
});


//stk lipa na mpesa

app.get('/stk',access,(req,res)=>{
    let endpoint ='https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    let phone = req.query.phone;
    let amount = req.query.amount;
    let auth ='Bearer ' + req.access_token;


    const time = timestamp('YYYYMMDDHHmmss');

    const password = new Buffer.from('150839' + '465487bb1823da2a0ab1e1122bcc5998d5c6a95de78a6fbdac616a2801e8270a' + time).toString('base64');


    request(
        {
           url : endpoint,
            method:"POST",
            headers :{
               "Authorization": auth
            },
            json :{
                "BusinessShortCode": "150839",
                "Password": password,
                "Timestamp": time,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone,
                "PartyB": "150839",
                "PhoneNumber": phone,
                "CallBackURL": "http://104.248.16.80:6001/callback",
                "AccountReference": "Adiy.site",
                "TransactionDesc": "Template Payment"
            }
        },
        function(error,response,body){
            if(error){
                console.log(error)
            }
            res.status(200).json(body);
        }
    )
});



app.get('/b2c', access, (req, res) => {
    const url = 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
        auth = 'Bearer ' + req.access_token;

    request({
            method: "POST",
            url: url,
            headers: {
                "Authorization": auth
            },
            json: {
                "InitiatorName":"apitest464",
                "SecurityCredential":"U17RmX1WP5WAvNwIdzwndf9yKCL7OWFyfVWnJNYD5O3z1sF+GkxIH5zJ9JnAlWFIltxoyVMcSB4dnUpHTgnrTEO+H5qoKx3zken98yyPkqXWlykEpDHGbfdng8SDjGWH/HYpqoCHtNgcIYwwt93frtkGNeGswZoT3vQ/Oti/c9WML869H6zzEfkVl9+MKaqbS8+G2vvVOA7iMRGO9A/8kCQH0Oa+NPpFVRi30NQqIr16wS202r2DpneyLT0SeAUtCyrbFfu6Dl+0J3ayNHAvHDk9PL3eRWw9ECNtrUwukOgRVE61kSisTawg5FhyqocNwka/YCicbVeTNkgBTDuFKQ==",
                "CommandID": "BusinessPayment",
                "Amount": "200",
                "PartyA": "601464",
                "PartyB": "254708374149",
                "Remarks": "please pay",
                "QueueTimeOutURL": "http://102.5.140.254:6001/b2c_timeout_url",
                "ResultURL": "http://102.5.140.254:6001/b2c_result_url",
                "Occasion": "endmonth"
            }
        },
        function (error, response, body) {
            if (error) {
                console.log(error)
            }
            else {
                res.status(200).json(body)
            }
        }
    )
})

app.get('/reverse', access, (req, res) => {
    const url = 'https://sandbox.safaricom.co.ke/mpesa/reversal/v1/request',
        auth = 'Bearer ' + req.access_token;

    request({
            method: "POST",
            url: url,
            headers: {
                "Authorization": auth
            },
            json: {
                "Initiator":"apitest464",
                "SecurityCredential":"WUbAmVqY9eoXkXIQbvq+OdLUYGesnWPJ5rT4KbzN3l6whpkibGx+N6jLapvPnkM3tbVfe8gyaa6hcrfCTP/3n9Vy6zGTiKQSrfmDBTBcg8ana21h9BMn5mEYAYg6e3u2NzSI+JUWKzxxD8XoBOIH8onWhb/qkuPiM4alzb0KZdVHt4BKAfihhUwuQAix6zixQctcieMIMAFxMVhvZicWwVkADlIrH+STpIKVmbGgwpB21fydyLiGx2vONFwIKGvU94lK6AwGOfVxV+LGM6xEQg2hRDsIZuGBy49pI2lF8og2OpdrJ+ohm49aLOpRwRHJMl4essaF8KVN5VG2oxR6Qw==",
                "CommandID":"TransactionReversal",
                "TransactionID":"NLJ11HAY8V",
                "Amount":"100",
                "ReceiverParty":"601342",
                "RecieverIdentifierType":"11",
                "ResultURL":"http://102.5.140.254:6001/reverse_result_url",
                "QueueTimeOutURL":"http://102.5.140.254:6001/reverse_timeout_url",
                "Remarks":"Wrong Num",
                "Occasion":"sent wrongly"
            }
        },
        function (error, response, body) {
            if (error) {
                console.log(error)
            }
            else {
                res.status(200).json(body)
            }
        }
    )
})

app.post('/reverse_result_url', (req, res) => {
    console.log("--------------------Reverse Result -----------------")
    console.log(JSON.stringify(req.body.Result.ResultParameters))
})

app.post('/reverse_timeout_url', (req, res) => {
    console.log("-------------------- Reverse Timeout -----------------")
    console.log(req.body)
})

app.post('/b2c_result_url', (req, res) => {
    console.log("-------------------- B2C Result -----------------")
    console.log(JSON.stringify(req.body.Result))
})

app.post('/b2c_timeout_url', (req, res) => {
    console.log("-------------------- B2C Timeout -----------------")
    console.log(req.body)
})

app.post('/callback', (req, res) => {
    console.log('.......... STK Callback ..................')
    console.log(JSON.stringify(req.body.Body.stkCallback))
})

app.post('/bal_result', (req, resp) => {
    console.log('.......... Account Balance ..................')
    console.log(req.body)
})

app.post('/bal_timeout', (req, resp) => {
    console.log('.......... Timeout..................')
    console.log(req.body)
})


function access(req,res,next){
    //access token
        consumer_key = "G8jVW6rF5k5t3I8pYxa1zlXA73GpT1Jf",
        consumer_secret = "XMoBx4jHu7mquxnL",
        url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        auth = "Basic " + new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");

    request(
        {
            url : url,
            headers : {
                "Authorization" : auth
            }
        },
        function (error, response, body) {
            // TODO: Use the body object to extract OAuth access token
            if(error){
                console.log(error);
            }
            else{
                req.access_token = JSON.parse(body).access_token;
                next()
            }
            console.log(body);

        }
    )
}

app.listen(6001,(err,live)=>{

    if(err){
        console.error(err);
    }

    console.log("server running on port 6001")

});
