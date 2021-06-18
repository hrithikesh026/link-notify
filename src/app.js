const path = require('path')
const bot = require('./utils/bot')
const cred = require('./utils/cred')
const subjects  = require('./utils/subjects')
const fs = require('fs');
const mongo = require('./db/mongo')
const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require('mongoose')



const mybot = new bot(cred.token)
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000


// console.log(jobs)

const instruction = `Select subject :

CG- /CG

SSCD- /SSCD

SCM- /SCM

WEB- /WEB

MADlab- /MADlab 

JavaJ2EE- /Java  

SSCD lab- /SSCDlab

CGlab- /CGlab`
console.log('app runnung')
app.get('/', function (req, res) {
    res.send('Welcome to Link Notifier')
  })
  
  // POST method route
  app.post('/'+cred.token,async function (req, res) {

    
    res.send('{"status":"POST request successfull"}')
    
    if(req.body.message.text){
      req.body.message.text = req.body.message.text.replace('@CEC_Form_FIller_bot','') //Filtering bot username
      
      if(req.body.message.text =='/list'){
        mybot.sendMessage(req.body.message.chat.id, instruction)
      }

      if(req.body.message.text in subjects){ //if text is a subject command,
        
        await mongo.jobs.findOne({subject: req.body.message.text}, function (err, docs) {
          if(err){
              console.log('Something went wrong while fetching jobs')
          }
          else{
              if(docs == null){ //If job doesn't already exists in job, create the job
                  job = new mongo.jobs({
                    subject: req.body.message.text,
                    users: [req.body.message.chat.id.toString()]
                  })
                  job.save().then(()=>{
                    console.log(job)
                  }).catch((error)=>{
                    console.log('Error! ',error)
                  });
                  mybot.sendMessage(req.body.message.chat.id, 'Successfull.\nWe will inform you when '+req.body.message.text.slice(1)+' form is enabled')
              }
              else{ //If job exits, append user to the job
                users = docs.users
                if(users.includes(req.body.message.chat.id)){
                  mybot.sendMessage(req.body.message.chat.id, 'Reminder already exists for '+req.body.message.text.slice(1))
                }
                else{
                  users.push(req.body.message.chat.id.toString())
                  mongo.jobs.updateOne({subject: req.body.message.text}, {users: users}, (error,res)=>{
                    if(error){
                      console.log('error while updating table '+error)
                    }
                  })
                  mybot.sendMessage(req.body.message.chat.id, 'Successfull.\nWe will inform you when '+req.body.message.text.slice(1)+' form is enabled')
                }

              }
          }
        });

      }
      if(req.body.message.text =='/delete'){ //for deleting  all the notification  of a user
        await mongo.jobs.find({},async function (err, docs) {
          if(err){
            console.log('Error occured in delete'+err)
          }else{
            docs.forEach(async (doc)=>{
              list = doc.users.filter((item)=>{
                item==req.body.message.chat.id.toString()
              })
              if(list.length == 0){
                await mongo.jobs.deleteOne({ subject: doc.subject });
              }
              else
              await mongo.jobs.updateOne({subject: doc.subject},{users: list},(err,doc)=>{
                if(error){
                  console.log('error while updating delete '+error)
                }
              })
            })
          }
        });
        mybot.sendMessage(req.body.message.chat.id, 'All notifications Deleted successfully!')
      }


      
    }
    
  })
  

app.listen(port,()=>{
    console.log('server up and running on port '+ port)
    
})
//todo : change port to 443