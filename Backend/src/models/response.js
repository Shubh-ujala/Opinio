// import mongoose from "mongoose";

// const answerSchema = new mongoose.Schema({
//     questionId :{
//         type : mongoose.Schema.Types.ObjectId,
//         required:true
//     },
//     optionId :{
//         type : mongoose.Schema.Types.ObjectId,
//         required:true
//     }
// }, { _id: false })

// const responseSchema = new mongoose.Schema({
//     pollId : {
//         type:mongoose.Schema.ObjectId,
//         required: true
//     },
//     optionId : {
//         type:mongoose.Schema.ObjectId,
//         required:true
//     },
//     answers : [answerSchema]
// },{timestamps:true})


// responseSchema.index({pollId:1})

import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  optionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, { _id: false })

const responseSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userId: {                           // ← was missing, needed for auth polls
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  answers: [answerSchema]
}, { timestamps: true })

responseSchema.index({ pollId: 1 })

const Response = mongoose.model('Response', responseSchema)

export { Response }

// const Response = mongoose.model('Response',responseSchema);

// export{Response}