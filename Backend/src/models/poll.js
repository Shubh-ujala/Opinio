import mongoose from "mongoose"
import { User } from "./user.js"

const optionSchema = new mongoose.Schema({
    text : {
        type:String,
        required:true
    }
})
const questionSchema = new mongoose.Schema({
    text : {
        type:String,
        required:true
    },
    isRequired:{
        type:Boolean,
        default:false
    },
    options : [optionSchema]
})
const pollSchema = new mongoose.Schema({
    creatorId : {
        type: mongoose.Schema.ObjectId,
        ref:User,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default :''
    },
    isAnonymous:{
        type:Boolean,
        default:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:['active','closed'],
        default:'active'
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    questions: [questionSchema]
    
},{timestamps:true})

const Poll =  mongoose.model('Poll',pollSchema)
export {
    Poll
}