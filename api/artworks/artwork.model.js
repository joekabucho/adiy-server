// Dependencies
const restful = require('node-restful');
const mongoose = restful.mongoose;

const artworksSchema = new mongoose.Schema({
    createdAt: {type: Date, default: Date.now},
    userId: {type: String},
    fileId: {type: String},
    data: {type: []},
});

// Return model
module.exports = restful.model('ArtWorks', artworksSchema);




