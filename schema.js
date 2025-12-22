const joi = require("joi");

const userShema = joi.object({
    FirstName: joi.string().required(),
    LastName: joi.string().required(),
    Email: joi.string().email().required(),
    Mobile: joi.number().integer().min(1000000000).max(9999999999).required(),
    Password: joi.string().min(6).required(),
});



module.exports = userShema;


