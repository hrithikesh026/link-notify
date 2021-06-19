const path = require('path')
const bot = require('./utils/bot')
const cred = require('./utils/cred')
const subjects  = require('./utils/subjects')
const fs = require('fs');
const mongo = require('./db/mongo')
const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const instructions  = require('./utils/instructions');
const request = require('request');
const axios = require('axios')

// console.log(instructions.listsubjects)
const mybot = new bot(cred.token)
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000


// console.log(jobs)


console.log('app runnung')
app.get('/', function (req, res) {
    res.send('Welcome to Link Notifier')
  })
  
  // POST method route
  app.post('/'+cred.token,async function (req, res) {

    
    res.send('{"status":"POST request successfull"}')
    
    if(req.body.message.text){
      req.body.message.text = req.body.message.text.replace('@CEC_Form_FIller_bot','') //Filtering bot username
      if(req.body.message.text =='/help'){
        mybot.sendMessage(req.body.message.chat.id, instructions.help)
      }

      else if(req.body.message.text =='/listsubjects'){
  
        mybot.sendMessage(req.body.message.chat.id, instructions.listsubjects)
      }

      else if(req.body.message.text in subjects){ //if text is a subject command,
        
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
      else if(req.body.message.text =='/deleteactive'){ //for deleting  all the notification  of a user
        await mongo.jobs.find({},async function (err, docs) {
          if(err){
            console.log('Error occured in delete'+err)
          }else{
            docs.forEach(async (doc)=>{
              
              var pos= -1
              doc.users.forEach((item,ind)=>{
                if(item == req.body.message.chat.id){
                  pos = ind
                }
              })
              if(pos!=-1){
                doc.users.splice(pos,1)
              }
            
              if(doc.users.length == 0){
                await mongo.jobs.deleteOne({ subject: doc.subject });
              }
              else
              await mongo.jobs.updateOne({subject: doc.subject},{users: doc.users},(err,doc)=>{
                if(err){
                  console.log('error while updating delete '+err)
                }
              })
            })
          }
        });
        mybot.sendMessage(req.body.message.chat.id, 'All notifications Deleted successfully!')
      }
      else if(req.body.message.text =='/showactive'){
        await mongo.jobs.find({},async function (err, docs){
          if(err){
            console.log('Error occured in show active'+err)
          }
          else{
            var sublist = []
            docs.forEach(async (doc)=>{
              if(doc.users.includes(req.body.message.chat.id.toString())){
                sublist.push(doc.subject)
              }
            })
            // console.log(sublist)
            if(sublist.length == 0){
              mybot.sendMessage(req.body.message.chat.id, instructions.noactive)
            }
            else{
              var str = ''
              // for(var item in sublist){
              //   
              // }
              sublist.forEach((sub)=>{
                str = str+'\n-'+sub.slice(1)
              })
              mybot.sendMessage(req.body.message.chat.id, 'Current active notifications are:'+str )
            }
          }
        })
      }
      

      
    }
    
  }
  )

  app.post('/'+cred.mahadevToken,async function (req, res) {

    
    res.send('{"status":"POST request successfull"}')
    
    if(req.body.message.text){
      req.body.message.text = req.body.message.text.replace('@CEC_Form_FIller_bot','') //Filtering bot username
      if(req.body.message.text =='/help'){
        mybot.sendMessage(req.body.message.chat.id, instructions.help)
      }

      else if(req.body.message.text =='/listsubjects'){
  
        mybot.sendMessage(req.body.message.chat.id, instructions.listsubjects)
      }

      else if(req.body.message.text in subjects){ //if text is a subject command,
        
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
      else if(req.body.message.text =='/deleteactive'){ //for deleting  all the notification  of a user
        await mongo.jobs.find({},async function (err, docs) {
          if(err){
            console.log('Error occured in delete'+err)
          }else{
            docs.forEach(async (doc)=>{
              
              var pos= -1
              doc.users.forEach((item,ind)=>{
                if(item == req.body.message.chat.id){
                  pos = ind
                }
              })
              if(pos!=-1){
                doc.users.splice(pos,1)
              }
            
              if(doc.users.length == 0){
                await mongo.jobs.deleteOne({ subject: doc.subject });
              }
              else
              await mongo.jobs.updateOne({subject: doc.subject},{users: doc.users},(err,doc)=>{
                if(err){
                  console.log('error while updating delete '+err)
                }
              })
            })
          }
        });
        mybot.sendMessage(req.body.message.chat.id, 'All notifications Deleted successfully!')
      }
      else if(req.body.message.text =='/showactive'){
        await mongo.jobs.find({},async function (err, docs){
          if(err){
            console.log('Error occured in show active'+err)
          }
          else{
            var sublist = []
            docs.forEach(async (doc)=>{
              if(doc.users.includes(req.body.message.chat.id.toString())){
                sublist.push(doc.subject)
              }
            })
            // console.log(sublist)
            if(sublist.length == 0){
              mybot.sendMessage(req.body.message.chat.id, instructions.noactive)
            }
            else{
              var str = ''
              // for(var item in sublist){
              //   
              // }
              sublist.forEach((sub)=>{
                str = str+'\n-'+sub.slice(1)
              })
              mybot.sendMessage(req.body.message.chat.id, 'Current active notifications are:'+str )
            }
          }
        })
      }
      else{
        axios.post(cred.mahadevURI, req.body).then((response)=>{
          console.log('Response from mahadev = '+response)
        }).catch((error)=>{
          console.log('Error from mahadev = '+error)

        })
      }

      
    }
    
  })
  

app.listen(port,()=>{
    console.log('server up and running on port '+ port)
    
})
//todo : change port to 443