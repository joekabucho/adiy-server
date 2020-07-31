const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Art = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    data:{ type: [] },
    userId: { type: String },
    fileId: {type: String}
});

module.exports = mongoose.model('AllArtWorks', Art);
