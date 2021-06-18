const cred = require('../utils/cred')
const  mongoose = require('mongoose')
const uri = 'mongodb+srv://link-notify:'+ cred.password+'@cluster0.k7izx.mongodb.net/link-notify-database?retryWrites=true&w=majority'
mongoose.connect(uri,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
// console.log(mongoose)
console.log('database running')
const jobs = mongoose.model('jobs',{
    subject: {
        type: String
    },
    users: {
        type: Array
    }
})
const users = mongoose.model('users',{
    chat_id: {Number},
    first_name: {String},
    last_name: {String},
    chat_type: String,
})


// const newjob = new jobs({
//     subject : '/SSCD',
//     users: ['1095149900']
// })
// newjob.save().then(()=>{
//     console.log(newjob)
// }).catch((error)=>{
//     console.log('Error! ',error)
// });







// const get_jobs = (sub,callback)=>{
//     // var result
//     jobs.find({ subject: sub}, function (err, docs) {
//         if(err){
//             callback('Something went wrong in get_jobs',undefined)
//         }
//         else{
//             // result = docs
//             callback(undefined, docs)
//             // console.log(result)
//         }
//     });
   
// }
// const get_users = (user,callback)=>{
//     // var result
//     users.find({ user_id: user}, function (err, docs) {
//         if(err){
//             callback('Something went wrong in get_users',undefined)
//         }
//         else{
//             // result = docs
//             callback(undefined, docs)
//             // console.log(result)
//         }
//     });
   
// }

// get_jobs('/WEB',(err,res)=>{
//     console.log(res)
// })
module.exports={
    jobs,users
}
