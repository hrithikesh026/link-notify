const path = require('path')
const bot = require('./utils/bot')
const cred = require('./utils/cred')
const subjects  = require('./utils/subjects')
const fs = require('fs');
// const hbs  = require('hbs')
// const forecast = require('./utils/forecast')
// const geocode = require('./utils/geocode')
const express = require('express')
const bodyParser = require("body-parser");
const mybot = new bot(cred.token)
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000


// console.log(jobs)

const instruction = `Select subject :

CNS- /CNS

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
  app.post('/'+cred.token, function (req, res) {
    // console.log(req.body)
    const rawdata = fs.readFileSync('./src/jobs.json');
    const jobs = JSON.parse(rawdata);
    res.send('{"status":"POST request successfull"}')
    
    if(req.body.message.text){
      if(req.body.message.text =='/list'){
        mybot.sendMessage(req.body.message.chat.id, instruction)
      }
      if(req.body.message.text in subjects){
        if(jobs[req.body.message.text]){
          if(jobs[req.body.message.text].includes(req.body.message.chat.id)){
            mybot.sendMessage(req.body.message.chat.id, 'Reminder already exists for '+req.body.message.text.slice(1))
          }
          else{
            jobs[req.body.message.text].push(req.body.message.chat.id)
          }
          
        }
        else{
          jobs[req.body.message.text] = []
          jobs[req.body.message.text].push(req.body.message.chat.id)
          mybot.sendMessage(req.body.message.chat.id, 'Successfull.\nWe will inform you when the form is enabled')
        }
        // console.log(jobs)
        
        let data = JSON.stringify(jobs, null, 2);
        fs.writeFileSync('./src/jobs.json', data);
      }
      // mybot.sendMessage(1095149900, 'Reminder set successfully')
    }
    
  })
  

app.listen(port,()=>{
    console.log('server up and running on port '+ port)
    
})
//todo : change port to 443