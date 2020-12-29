
const fs = require('fs');
const readline = require('readline');
const fileUpload = require('express-fileupload');
var nodemailer = require('nodemailer');
const Templates = require('./files.model');
const Config = require('../../config/dev');
const FacebookService = require('../services/facebook.service');
const pdf2html = require('pdf2html');
const filesService = require('../services/files.service');
var rimraf = require("rimraf");
const jimp = require('jimp');

exports.upload = (req, res, body) => {

        const details = {
            name: req.body.name,
            user: req.body.user,
            uploadedby: req.body.uploadedby,
            amount: req.body.amount,
            type: req.body.type,
            tags: req.body.tags,
            url: req.body.url,
            filename: req.body.filename,
            artworkid:req.body.artworkid,
            date: new Date()
        }
        let template = new Templates(details);
        template.save();
        res.status(200).json(details);
}

exports.view = (req, res) => {
    fs.readdir('./files/', function(err, items) {
        res.send(items);
    })
}

exports.getUsers = (req, res) => {
    Templates.find({ user: req.body.userid }, function(err, result) {
        if (err) {
            res.status(500).json("An Error Occcured")
        }
        res.status(200).json(result)
    })
}

exports.getAll = (req, res) => {
    Templates.find().exec(function(err, result) {
        if (err) {
            res.status(500).json("An Error Occured")
        }
        res.status(200).json(result)
    })
}

exports.test = (req, res) => {
    console.log("Called");
}

exports.fbpost = (req, res, next) => {
    var response = FacebookService.facebookPost(req.body);
    if (response != 'Error') {
        res.status(200).json(response);
    } else {
        res.status(500).json(response);
    }
}

exports.delete = (req, res, next) => {
    filesService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
};


exports.tohtml = (req, res) => {
    pdf2html.html('sample.pdf', (err, html) => {
        if (err) {
            console.error('Conversion error: ' + err)
        } else {
            console.log(html)
        }
    })
}
exports.getOne = (req, res, next) => {
    filesService.getOne(req.params.user)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
};
