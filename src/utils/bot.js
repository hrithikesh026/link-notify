const request= require('request')

class bot{
 constructor(token){
    this.token = token ;
    this.count = 0; 
 }

 sendMessage =async (chat_id, text)=>{
     const url = 'https://api.telegram.orgbot'+this.token+'/sendMessage?chat_id='+chat_id+'&text='+text;
    request( {url, json:true},(error, success)=>{
        if(error){
            console.log('failed')
            // this.count++;
            // if(this.count==5){
            //     return console.log("Couldn't send Notification");
            // }
            // setTimeout(() => {
            //     this.sendMessage(chat_id,text)
            // }, 2000);
        }
        else {
            return 'success'
        }
    })
 }


}
module.exports = bot