import mongoose from "mongoose";
import { hashPassword } from "../utils/password.js";

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
        maxlength:20,
        minlength:8
    }
},{timestamps:true})

// hash the password before saving to the database
userSchema.pre('save',async function(nxt){

    if(!this.isModified('password')) return;

    this.password = await hashPassword(this.password)
})

const User = mongoose.model('User',userSchema);

export {User};