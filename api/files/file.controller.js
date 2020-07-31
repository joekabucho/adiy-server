const fs = require('fs');
const readline = require('readline');
const fileUpload = require('express-fileupload');
var nodemailer = require('nodemailer');
const Templates = require('./files.model');
const Config = require('../../config/dev');
const FacebookService = require('../services/facebook.service');
const pdf2html = require('pdf2html');
const filesService = require('../services/files.service');
const compress_images = require("compress-images");
var rimraf = require("rimraf");





function Compressor() {
    // rimraf("files/thumbnails/", function() { console.log("done"); });

    compress_images(
        "files/**/*.{jpg,JPG,jpeg,JPEG,png,gif}",
        "files/thumbnails/", { compress_force: false, statistic: true, autoupdate: true },
        false, { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } }, { png: { engine: "pngquant", command: ["--quality=20-50"] } }, { svg: { engine: "svgo", command: "--multipass" } }, {
            gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
        },
        function(error, completed, statistic) {
            console.log("-------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("-------------");
        }
    );
}


exports.upload = (req, res, body) => {

    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
    let sampleFile = req.files.sampleFile;

    sampleFile.mv('./files/' + sampleFile.name, function(err) {
        if (err)
            return res.status(500).send(err);

        const details = {
            name: sampleFile.name,
            url: Config.Address + '/' + sampleFile.name,
            user: req.body.user,
            uploadedby: req.body.uploadedby,
            amount: req.body.amount,
            type: req.body.type,
            tags: req.body.tags,
            filename: req.body.namefile,
            date: new Date()
        }
        let template = new Templates(details);
        template.save();
        res.status(200).json(details);
        Compressor();

    });
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
