// Dependencies
const express = require('express');
const app = express();
const router = express.Router();


// Models
const ArtWork = require('./artwork.model');


// Routes
ArtWork.methods(['get', 'put', 'post', 'delete']);
ArtWork.register(router, '/artworks');


// Return router
module.exports = router;
