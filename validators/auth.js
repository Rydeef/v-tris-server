const { check } = require("express-validator");

module.exports.registerValidator = [
    check('email', "Incorrect email").isEmail()
]