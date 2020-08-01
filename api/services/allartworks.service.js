const Secret = require('../../config/dev').Secret;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const AllArtWorks = require('../allartworks/allArtWorks.model');



// Get All Users
async function getAll() {
    return await AllArtWorks.find({});
}


// Get One
async function getOne(fileId) {
    return AllArtWorks.find({"fileId":fileId});
}






module.exports = {  getAll, getOne };



