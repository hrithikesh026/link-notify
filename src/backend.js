const fs = require('fs')
const request = require('request')
const subjects = require('./utils/subjects')
const bot = require('./utils/bot')
const cred = require('./utils/cred')
const mongo = require('./db/mongo')

const mybot = new bot(cred.token)
console.log('backend running')

function myLoop() {         
  setTimeout(function() {  
      
      mongo.jobs.find({}, function (err, data) {
        if(err){
            console.log('Something went wrong while fetching jobs in backend ')
        }
        else{
            if(data.length != 0)
            
                check(data)
            
      }}

      );
    // console.log(docs)
    myLoop()

              
    },30000)
}
//Loop with 30 seconds delay
myLoop()


//checking if links are enabled
const check =(jobs)=>{
    try{
    jobs.forEach((job)=> {
        
        const url = subjects[job.subject]
        
        request( url, (error, success)=>{
            if(error){
                console.log('Error while pinging the google form '+job.subject)
                return
            }
            else if(success.body){
                // console.log('ping successful '+job.subject)

                //If enables, Send a notification to all the users registered for that subject 
                if(success.body.includes('is no longer accepting responses') == false){
                    // console.log("Not enabled")
                    
                    job.users.forEach((item)=>{
                        console.log(item)
                        mybot.sendMessage(item, 'Hello there!\n'+ job.subject.slice(1) +' is enabled now\n' + url)
                        
                    });
                    
                    mongo.jobs.deleteOne({ subject: job.subject }).then(()=>{
                        console.log(job.subject + ' deleted successfully')
                        mybot.sendMessage(-571199927, 'Deleted ' + job.subject)
                    }).catch((error)=>{
                        console.log('Deletion error! in backend'+error)
                    })
              
                }
                return
            }
        })

    });
    }
    catch(err){
        mybot.sendMessage(1095149900, 'An error occured in backend\n\n'+err)
    }
}