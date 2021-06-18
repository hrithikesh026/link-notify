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
            //     check(docs)
            // docs = data
            // check(data);
            // console.log(data+'\n\n')
                check(data)
            
      }}

      );
    // console.log(docs)
    myLoop()

    // const rawdata = fs.readFileSync('./src/jobs.json');
    // const jobs = JSON.parse(rawdata);              
    },30000)
}
myLoop()

const myFunction = ()=>{
    
}

const check =(jobs)=>{
    try{
    jobs.forEach((job)=> {
        // if(jobs[key] == undefined){
        //     continue
        // }
        const url = subjects[job.subject]
        
        request( url, (error, success)=>{
            if(error){
                console.log('Error while pinging the google form '+job.subject)
                return
            }
            else if(success.body){
                console.log('ping successful '+job.subject)
                if(success.body.includes('is no longer accepting responses') == false){
                    // console.log("Not enabled")
                    
                    job.users.forEach((item)=>{
                        console.log(item)
                        mybot.sendMessage(item, 'Hello there!\n'+ job.subject.slice(1) +' is enabled now\n' + url)
                        
                    });
                    // delete jobs[key]
                    mongo.jobs.deleteOne({ subject: job.subject }).then(()=>{
                        console.log('deleted successfully')
                    }).catch((error)=>{
                        console.log('Deletion error! in backend'+error)
                    })
                    // let data = JSON.stringify(jobs, null, 2);
                    // fs.writeFileSync('./src/jobs.json', data);
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