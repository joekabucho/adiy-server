const Cart = require('./cart.model');
const Paid = require('./paid.model');
const config = require('../../config/dev');
var crypto = require('crypto');
const https = require('axios');
var key = 'erty34sdfgh';
var request = require("request");

const options = {
    apiKey: config.apiKey,// use your sandbox app API key for development in the test environment
    username: config.userName,      // use 'sandbox' for development in the test environment
};
const AfricasTalking = require('africastalking')(options);

exports.getAll = (req, res) =>{
    Cart.find().exec(function(err, result){
        if(err){
            res.status(500).json("An Error Occured")
        }
        res.status(200).json(result);
    })
}

exports.getAUsers = (req, res) => {
    Cart.find({user: req.body.userid}, function(err, result){
         
        if(err){
            res.status(500).json("An Error Occcured")
        }
        if(result.length>0){
            if(result[0].status == "Pending" || result[0].status == "Processing"){

            res.status(200).json(result);

            }else{
                res.status(404).json("Not found")
            }
    }
    else{
        res.status(404).json("Not found");
    }
    })
}

exports.getPaid= (req, res) => {
    Cart.find({user: req.body.userid}, function(err, result){
        if(err){
            res.status(500).json("An Error Occcured")
        }
        if(result[0].status == "Paid"){
        res.status(200).json(result);
        }else{
            res.status(404).json("Nothing")
        }
    })
}

exports.add = (req, res) =>{

    const cart ={
        user: req.body.user,
        items: req.body.items,
        status: req.body.status,
        amount: req.body.amount
    }

    let newCart = new Cart(cart);
    newCart.save().then(function(result, err){
        
        if(err){
            res.status(500).json("An error occured");
        }
        if(result){
            console.log("Saved");
            res.status(200).json(result);
        }
    })
}


exports.addItem = (req, res) =>{

    Cart.findById(req.body._id, function(err, result){
        if(err){
            res.status(500).json("An error occured");
        }
        if(result.length < 1){
            res.status(404).json("Not found");
        }

        result.items =  req.body.items,
        result.user = req.body.user,
        result.status =  req.body.status,
        result.amount = req.body.amount

        result.save(function(err, saved){
            if(err){
                res.status(500).json("An Error Occured")
            }
            res.status(200).json(saved);
        })
    })
}

exports.changeStatus = (req,res) => {
    Cart.find({user: req.body.userid}, function(err, result){
        if(err){
            res.status(500).json("An error occured");
        }
        if(result){
            console.log(result[0]._id);
             const paid = new Paid({
                 user: result[0].user,
                 items: result[0].items,
                 status: "Processing"
             });
             paid.save();
             Cart.findByIdAndDelete(result[0]._id, function(err, deleted){
                if(err){
                    res.status(500).json("An error occured updating record")
                }
                if(deleted){
                res.status(200).json("Updated");
                }
             });  
        }
        else{
                res.status(200).json("Nothing to update")
        }
    })
}

exports.deleteItem =(req, res) => {
    Cart.findById(req.params.id, function(err, result){
       
        if(err){
            res.status(500).json("An error occured")
        }
        if(result){
           Cart.deleteOne({_id: result._id}, function(err, result){
             
               if(err){
                   res.status(500).json("An error occured")
               }
               res.status(200).json(result)
           })
        }
    })
}

exports.checkout = (req, res) =>{
    const cartid = req.body._id;
    Cart.findById(req.body._id, async function(err, result){
         
        if(err){
            res.status(500).json('An error occured')
        }
        if(result.length <1){
            res.status(404).json("Cart item not found")
        }
        service = AfricasTalking.PAYMENTS;

        const options ={

            productName: config.ATaccount,
            providerChannel: '525900',
            currencyCode: 'KES',
            phoneNumber: req.body.phone,
            amount:Number(req.body.amount),
            metadata: {}
        }
        console.log(options);

        service.mobileCheckout(options).then(response =>{
            
             const paid ={
                user: result.user,
                items: result.items,
                status: result.status,
                amount: result.amount,
                date: new Date(),
                transactionId: response.transactionId
             }
             let savePayment = new Paid(paid);
             savePayment.save().then(async function(result, err){
                 if(err){
                     res.status(500).json("An Error Occured")
                 }if(result){
                 await Cart.deleteOne({_id: cartid});
                 res.status(200).json(result);
                 }
             });
        }).catch(error=>{
            res.status(500).json("An error occured");
        });
            
    })
}



exports.cardpay = async (req, res) => {

        const options = req.body;
        const dstr = options['live'].concat( options['oid'],options['inv'],options['ttl'],options['tel'],options['eml'],options['vid'],options['curr'],options['p1'], options['p2'], options['p3'], options['p4'],options['cbk'],options['cst'],options['crl']);
        var hmac = crypto.createHmac('sha1', key);
        hmac.update(dstr);
        const tosend = hmac.digest('hex');
        const final2 = options;
        final2['hsh'] = tosend;

        request({
            url : "https://payments.ipayafrica.com/v3/ke",
            method : "POST",
            form : final2
        },function(err,resp,body){
            if(err){
                res.status(500).json(err)
            }
            if(res){
                res.status(200).json(resp);
            }
            if(body){
                res.status(200).json(body);
            }
        });  
  //  })
}

exports.checkTransaction = async (req, res) =>{
    const options = req.body;
    const dstr = options['oid'].concat(options['vid']);
    var hmac = crypto.createHmac('sha256', key);
    hmac.update(dstr);
    const tosend = hmac.digest('hex');
    const final2 = options;
    final2['hash'] = tosend;
    getHash(dstr);

    request({
        url : "https://apis.ipayafrica.com/payments/v2/transaction/search",
        method : "POST",
        form : final2
    },function(err,resp,body){
        if(err){
           // console.log(err)
            res.status(500).json(err)
        }
        if(res){
           // console.log(resp);
            res.status(200).json(resp);
        }
        
    });  
}


exports.getPayments = (req, res)=>{
    Paid.find().exec(function(err,result){
        if(err){
            res.status(500).json("An Error Occured")
        }
        res.status(200).json(result);
    })
}

exports.getUsersPayments = (req, res)=>{
    Paid.find({user: req.body.userId},function(err,result){
        if(err){
            res.status(500).json("An Error Occured")
        }
        res.status(200).json(result);
    })
}

exports.updatePaidStatus = (req,res) =>{
    Paid.find({user: req.body.userid}, function(err, result){
        if(err){
            res.status(500).json("Error in updating paid status");

        }if(result){
            result[0].status = "Paid"
            result[0].save();
            res.status(200).json("Updated template status");
        }
    })
}

function getHash(string){
    var hmac = crypto.createHmac('sha256', key);
    hmac.update(string);
    console.log(hmac.digest('hex'));
    return hmac.digest('hex'); 
};