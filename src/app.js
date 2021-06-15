const path = require('path')
const bot = require('./utils/bot')
const cred = require('./utils/cred')
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
const instruction = 'Select subject :\n\nCNS- /CNS\n\nSSCD- /SSCD\n\nSCM- /SCM'

app.get('/', function (req, res) {
    res.send('Welcome to Link Notifier')
  })
  
  // POST method route
  app.post('/', function (req, res) {
    console.log(req.body)
    res.send('POST request to the homepage')
    if(req.body.message.text){
      mybot.sendMessage(req.body.message.chat.id, instruction)
      // mybot.sendMessage(1095149900, 'Reminder set successfully')
    }
    
  })
  

app.listen(port,()=>{
    console.log('server up and running on port '+ port)
    
})
