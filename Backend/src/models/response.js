import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    questionId :{
        type : mongoose.Schema.ObjectId,
        required:true
    },
    optionId :{
        type : mongoose.Schema.ObjectId,
        required:true
    }
})

const responseSchema = new mongoose.Schema({
    pollId : {
        type:mongoose.Schema.ObjectId,
        required: true
    },
    optionId : {
        type:mongoose.Schema.ObjectId,
        required:true
    },
    answers : [answerSchema]
},{timestamps:true})


responseSchema.index({pollId:1})

module.exports = mongoose.model('Response',responseSchema);