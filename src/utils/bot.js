const request= require('request')

class bot{
 constructor(token){
    this.token = token ;
    this.count = 0; 
 }

 sendMessage =async (chat_id, text)=>{
     const url = 'https://api.telegram.org/bot'+this.token+'/sendMessage?chat_id='+chat_id+'&text='+text;
    request( {url, json:true},(error, success)=>{
        if(error){
            console.log('failed'+error)
            this.count++;
            if(this.count==5){
                return console.log("Couldn't send Notification\n Telegram down");
            }
            setTimeout(() => {
                this.sendMessage(chat_id,text)
            }, 5000);
        }
        else {
            return 'success'
        }
    })
 }


}
module.exports = bot