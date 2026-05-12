import mongoose from "mongoose";
import { hashPassword } from "../utils/password";

// userSchema
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        maxlength:20
    }
},{timestamps:true})

// hash the password before saving to the database
userSchema.pre('save',async function(next){

    if(!this.isModified(this.password)) return next();

    this.password = await hashPassword(this.password)
    next();
})

const User = mongoose.model('User',userSchema);

export {User};