var FB = require('fb');
var fs = require('fs');

function facebookPost (reqParams){
    FB.setAccessToken('EAAoRIdLiIMIBALYJq4s71iXJcE83iRBxDwILBMPX4PBmjuFMWu0JZCd61EEaM0HcoSF3OOkOSjHxT984328CT97WQq9VVAFKLlo7kywn7TPD70B6eLLUevEQZB5ZB0cojZBRcJewSL5lKbxgvOj9p41TjTfkCcbcQqmrHA5YTPqNWZCuBiJnhrHGyvu8wKD4ZD');
    FB.api('206188966617764/photos', 'post', { source: fs.createReadStream(reqParams.url), caption: reqParams.caption }, function (res) {
        if(!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          return 'Error';
        }
       return res.post_id;
      });

}

module.exports = {facebookPost}