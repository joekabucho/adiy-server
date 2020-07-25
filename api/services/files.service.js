const Secret = require('../../config/dev').Secret;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const Templates = require('../files/files.model');





//Delete files
async function _delete(id) {
    await Templates.deleteOne({_id: id});
}

module.exports = {delete: _delete };



