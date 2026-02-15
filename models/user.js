const mongoose = require("mongoose");
const schema = mongoose.Schema;
const plm = require("passport-local-mongoose");
const passportLocalMongoose = plm.default || plm;



const userSchema = new schema({
    email:{
        type:String,
        required:true 
    }

})


userSchema.plugin(passportLocalMongoose);

const user = mongoose.model("user",userSchema);
module.exports=user;

