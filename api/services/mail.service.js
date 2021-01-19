const nodemailer = require('nodemailer');
let cron = require('node-cron');

 
 function sendMailToClient(reqParam){
    return new Promise((resolve, reject)=>{

        let options = {
            host: "mail.adiy.site",
            port: 465,
            auth: {
                user: 'help.adiy@gmail.com',
                pass: '2020@diy' 
            }
        }

        let transporter = nodemailer.createTransport((options));
    
        let email = {
            from: reqParam.sender, 
            to: reqParam.reciever,  
            subject: reqParam.subject,  
            text: reqParam.message
        };
    
        transporter.sendMail(email, function (err, data) {
            !err ? resolve() : reject('Something went wrong');
         });
    
    });
}


function inviteUser(reqParam){
    return new Promise((resolve, reject)=>{

        let options = {
            host: "mail.adiy.site",
            port: 465,
            auth: {
                user: 'help.adiy@gmail.com',
                pass: '2020@diy' 
            }
        }

        let transporter = nodemailer.createTransport((options));
    
        let email = {
            from: reqParam.sender, 
            to: reqParam.reciever, 
            cc: 'mwangi.gicheru@gmail.com', 
            subject: "Invitation To Adiy",  
            text: 'Hello',
            html: 'You have been invited to Aidy. Please click on the link below to register:<br><br> <button style="margin-left:70px;border:none;padding:7px;border-radius:5px;background-color:teal;color:white;"><a style="color:white;font-size:14px;font-family:verdana" href="http://localhost/register/' + reqParam.reciever + '/' + reqParam.token + '">Invitation</a></button>'
        };
    
        transporter.sendMail(email, function (err, data) {
            !err ? resolve() : reject('Something went wrong');
         });
    

    });
}

function emailVerification(reqParam){
    return new Promise((resolve, reject)=>{

        let options = {
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: 'help.adiy@gmail.com',
                pass: '2020@diy' 
            }
        }

        let transporter = nodemailer.createTransport((options));
    
        let email = {
            from: 'help.adiy@gmail.com', 
            to: reqParam.email,  
            cc: 'mwangi.gicheru@gmail.com', 
            subject: "Verification Code",  
            text: 'Hello',
            html: `
            <div style="border: 1px solid #ededed; border-radius: 4px; background-color: #ffffff; padding: 20px;">
               <div style="background-color: #e0e0e0; text-align:center;">
                    
               </div>
               <h2 style="text-transform: uppercase;"><strong>Use this code to finish your account set up! </strong></h2>
               <hr>
               <h2> ${reqParam.reset_code}</h2>
               <hr>
              <p>Thank you for partnering up with Adiy, we are happy to have you onboard.</p>
              <img src="cid:unique@kreata.ee"/>
           </div>
    
           <div style="text-align:center">
   
            <p> &copy; 2021 <a href="google.com">Adiy</a> </p>
            <p> For Inquiries:</p>
            <p> Phone: +254 794 619 062 | Email : info@adiy.com </p>
            </div>
       </div>
   </div>
           <br>
   `,
   attachments: [{
    filename: 'welcome.gif',
    path: './welcome.gif',
    cid: 'unique@kreata.ee' //same cid value as in the html img src
}]
   
        };
    
        transporter.sendMail(email, function (err, data) {
            !err ? resolve() : reject(err);
         });
    

    });
}

function passwordResetCode(reqParam){
    return new Promise((resolve, reject)=>{

        let options = {
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: 'help.adiy@gmail.com',
                pass: '2020@diy' 
            }
        }

        let transporter = nodemailer.createTransport((options));
    
        let email = {
            from: 'help.adiy@gmail.com', 
            to: reqParam.email,  
            cc: 'mwangi.gicheru@gmail.com', 
            subject: "Reset Code",  
            text: 'Hello',
            html: `
            <div style="border: 1px solid #ededed; border-radius: 4px; background-color: #ffffff; padding: 20px;">
               <div style="background-color: #e0e0e0; text-align:center;">
                    
               </div>
               <h2 style="text-transform: uppercase;"><strong>Use this code to reset your account password! </strong></h2>
               <hr>
               <h2> ${reqParam.reset_code}</h2>
               <hr>
              <p>Thank you for partnering up with Adiy, we are happy to have you onboard.</p>
              <img src="welcome.gif">
           </div>
         
           <div style="text-align:center">
   
            <p> &copy; 2021 <a href="google.com">Adiy</a> </p>
            <p> For Inquiries:</p>
            <p> Phone: +254 794 619 062 | Email : info@adiy.com </p>
            </div>
                </div>
            </div>
        <br>
         `
        };
    
        transporter.sendMail(email, function (err, data) {
            !err ? resolve() : reject(err);
         });
    

    });
}

function fiveDaysToExpiry(reqParam){
    return new Promise((resolve, reject)=>{

        let options = {
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: 'help.adiy@gmail.com',
                pass: '2020@diy'
            }
        }

        let transporter = nodemailer.createTransport((options));

        let email = {
            from: 'help.adiy@gmail.com',
            to: reqParam.email,
            cc: 'mwangi.gicheru@gmail.com',
            subject: "Account Expiry",
            text: 'Hello',
            html: `
            <div style="border: 1px solid #ededed; border-radius: 4px; background-color: #ffffff; padding: 20px;">
               <div style="background-color: #e0e0e0; text-align:center;">
                    
               </div>
               <h2 style="text-transform: uppercase;"><strong>Your Adiy account has 5 days of subscription remaining! </strong></h2>
               <hr>
               <h2> ${reqParam.reset_code}</h2>
               <hr>
              <p>Thank you for partnering up with Adiy, we are happy to have you onboard.</p>
              <img src="cid:unique@kreata.ee"/>
           </div>
    
           <div style="text-align:center">
   
            <p> &copy; 2021 <a href="google.com">Adiy</a> </p>
            <p> For Inquiries:</p>
            <p> Phone: +254 794 619 062 | Email : info@adiy.com </p>
            </div>
       </div>
   </div>
           <br>
   `,
            attachments: [{
                filename: 'five.png',
                path: './five.png',
                cid: 'unique@kreata.ee' //same cid value as in the html img src
            }]

        };

        transporter.sendMail(email, function (err, data) {
            !err ? resolve() : reject(err);
        });


    });
}

function threeDaysToExpiry(reqParam){
    return new Promise((resolve, reject)=>{

        let options = {
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: 'help.adiy@gmail.com',
                pass: '2020@diy'
            }
        }

        let transporter = nodemailer.createTransport((options));

        let email = {
            from: 'help.adiy@gmail.com',
            to: reqParam.email,
            cc: 'mwangi.gicheru@gmail.com',
            subject: "Account Expiry",
            text: 'Hello',
            html: `
            <div style="border: 1px solid #ededed; border-radius: 4px; background-color: #ffffff; padding: 20px;">
               <div style="background-color: #e0e0e0; text-align:center;">
                    
               </div>
               <h2 style="text-transform: uppercase;"><strong>Your Adiy account has 3 days of subscription remaining! </strong></h2>
               <hr>
               <h2> ${reqParam.reset_code}</h2>
               <hr>
              <p>Thank you for partnering up with Adiy, we are happy to have you onboard.</p>
              <img src="cid:unique@kreata.ee"/>
           </div>
    
           <div style="text-align:center">
  
            <p> &copy; 2021 <a href="google.com">Adiy</a> </p>
            <p> For Inquiries:</p>
            <p> Phone: +254 794 619 062 | Email : info@adiy.com </p>
            </div>
       </div>
   </div>
           <br>
   `,
            attachments: [{
                filename: 'three.png',
                path: './three.png',
                cid: 'unique@kreata.ee' //same cid value as in the html img src
            }]

        };

        transporter.sendMail(email, function (err, data) {
            !err ? resolve() : reject(err);
        });


    });
}

function dayOfExpiry(){
    return new Promise((resolve, reject)=>{

        let options = {
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: 'help.adiy@gmail.com',
                pass: '2020@diy'
            }
        }

        let transporter = nodemailer.createTransport((options));

        let email = {
            from: 'help.adiy@gmail.com',
            to: 'joekabucho2@gmail.com',
            cc: 'mwangi.gicheru@gmail.com',
            subject: "Account Expiry",
            text: 'Hello',
            html: `
            <div style="border: 1px solid #ededed; border-radius: 4px; background-color: #ffffff; padding: 20px;">
               <div style="background-color: #e0e0e0; text-align:center;">
                    
               </div>
               <h2 style="text-transform: uppercase;"><strong>Your Adiy account expires today! </strong></h2>
               <hr>
               <h2> ${reqParam.reset_code}</h2>
               <hr>
              <p>Thank you for partnering up with Adiy, we are happy to have you onboard.</p>
              <img src="cid:unique@kreata.ee"/>
           </div>
    
           <div style="text-align:center">
   
            <p> &copy; 2021 <a href="google.com">Adiy</a> </p>
            <p> For Inquiries:</p>
            <p> Phone: +254 794 619 062 | Email : info@adiy.com </p>
            </div>
       </div>
   </div>
           <br>
   `,
            attachments: [{
                filename: 'one.png',
                path: './one.png',
                cid: 'unique@kreata.ee' //same cid value as in the html img src
            }]

        };

        transporter.sendMail(email, function (err, data) {
            !err ? resolve() : reject(err);
        });


    });
}


 module.exports = { sendMailToClient, inviteUser, emailVerification, passwordResetCode,fiveDaysToExpiry,threeDaysToExpiry,dayOfExpiry }
