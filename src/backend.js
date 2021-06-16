const fs = require('fs')
const request = require('request')
const subjects = require('./utils/subjects')
const bot = require('./utils/bot')
const cred = require('./utils/cred')

const mybot = new bot(cred.token)
console.log('backend running')
function myLoop() {         
  setTimeout(function() {   
    const rawdata = fs.readFileSync('./src/jobs.json');
    const jobs = JSON.parse(rawdata);  
    check(jobs) 
    myLoop()                  
  }, 4000)
  
}
myLoop()

const check = async (jobs)=>{
    for (var key in jobs) {
        url = subjects[key]
        // console.log(url)
        // if(url!=undefined){
        request( url,(error, success)=>{
            if(error){
                console.log('Error while pinging the google form')
            }
            else if(success.body){
                if(success.body.includes('is no longer accepting responses') == false){
                    // console.log("Not enabled")
                    jobs[key].forEach((item)=>{
                        console.log(item)
                        mybot.sendMessage(item, 'Hello there '+ key.slice(1) +' is enabled now\n' + url)
                        
                    });
                    delete jobs[key]
                    let data = JSON.stringify(jobs, null, 2);
                    fs.writeFileSync('./src/jobs.json', data);
                }
                
            }
        })

    }
}