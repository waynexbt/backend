const mongoose = require('mongoose');

const role = new mongoose.Schema({
    role: {type:String, required:true}
},{autoIndex:true});

const Role = mongoose.model('role', role);

module.exports = Role;