const bcrtptjs = require('bcryptjs');
const helpers = {
    encrypPassword:async function(password){
        const hash = await bcrtptjs.hash(password,8);
        return hash;
    },

    matchPassword: async function(password,savePassword){
        try{
           return await bcrtptjs.compare(password,savePassword);
        }catch(e){
            console.log("Ha ocurrido un problema!");
        }
    }

};

module.exports = helpers;