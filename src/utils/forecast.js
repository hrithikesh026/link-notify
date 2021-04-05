const request = require('request')

const forecast = (latitude, longitude , callback)=>{
    const url = 'http://api.openweathermap.org/data/2.5/weather?&lat=' +latitude+'&' + 'lon=' +longitude+ '&appid=82fa3a9b46f85e5583b2d0e4bc71f11b&units=metric'
    request({url, json: true}, (error,{body})=>{
        if(error){
            callback('Unable to connnect to location   service ',undefined)
        }
        else if(body.message){
            callback(undefined, 'Location  not found')
        }
        else {
            callback(undefined, body)
        }
    })
}

module.exports = forecast