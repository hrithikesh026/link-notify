const request= require('request')

class bot{
 constructor(token){
    this.token = token ;
 }
 sendMessage = (chat_id, text)=>{
     const url = 'https://api.telegram.org/bot'+this.token+'/sendMessage?chat_id='+chat_id+'&text='+text;
    request( {url, json:true},(error, success)=>{
        if(error){
            return 'error'
        }
        else {
            return 'success'
        }
    })
 }


}
module.exports = bot