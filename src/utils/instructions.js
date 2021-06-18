const request = require('request')
const listsubjects = `Select subject :

CG - /CG

SS&CD - /SSCD

SCM - /SCM

WEB - /WEB

MAD lab - /MADlab 

Java J2EE - /Java  

SSCD lab - /SSCDlab

CG lab - /CGlab`

const help = `Welcome!
I can send you a notification when an attendance link is enabled
use below commands to talk to me

/listsubjects - display a menu of subjects

/deleteactive - delete all active notification

/showactive - show a list of active notification

/help - to display this menu`

const noactive = `Seems like don't have an active notification for any subjects
send /listsubjects to list out all subjects and then select a subject of your choice`

setInterval(()=>{
    request('https://form-reminder.herokuapp.com/',(err,data)=>{
        console.log('refreshed')
    })
},1000 * 60 * 10)
// console.log(listsubjects)
module.exports = {
    noactive,help,listsubjects
}