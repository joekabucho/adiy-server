const AllArtWorks = require('./allArtWorks.model');
const ArtWorksService = require('../services/allartworks.service');
const config = require('../../config/dev');
var crypto = require('crypto');
const https = require('axios');
var request = require("request");


exports.getAll = (req, res) =>{
    AllArtWorks.find().exec(function(err, result){
        if(err){
            res.status(500).json("An Error Occured")
        }
        res.status(200).json(result);
    })
}

exports.add = (req, res) =>{

    const art ={
        userId: req.body.userId,
        fileId: req.body.fileId,
        data: req.body.data
    }

    let newArt = new AllArtWorks(art);
    newArt.save().then(function(result, err){
        
        if(err){
            res.status(500).json("An error occured");
        }
        if(result){
            console.log(result.fileId);
            console.log("Saved");
            const duplicateFileId = result.fileId;
            res.status(200).json(result);
            AllArtWorks.find().exec(function(err, result){
                if(err){
                    res.status(500).json("An Error Occured")
                }


                const output = result.filter(function(x){return x.fileId===duplicateFileId}); //arr here is you result array
                if (output.length>0){
                    console.log("duplicates exist");
                    console.log(output);
                }
                console.log(duplicateFileId);
                // if(result.fileId===duplicateFileId){
                //     console.log("duplicate file ID found");
                // }
            })
        }
    })
}



exports.deleteItem =(req, res) => {
    AllArtWorks.findById(req.params.id, function(err, result){
       
        if(err){
            res.status(500).json("An error occured")
        }
        if(result){
            AllArtWorks.deleteOne({_id: result._id}, function(err, result){
             
               if(err){
                   res.status(500).json("An error occured")
               }
               res.status(200).json(result)
           })
        }
    })
}

exports.getOne = (req, res, next) => {
    ArtWorksService.getOne(req.params.fileId)
        .then(fileId => fileId ? res.json(fileId) : res.sendStatus(404))
        .catch(err => next(err));
};



