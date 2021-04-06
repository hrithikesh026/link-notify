

 


const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const message1 = document.querySelector('#message-1')
const message2 = document.querySelector('#message-2')


weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const location = search.value
    message1.textContent = 'Loading'
    message2.textContent = ''
    fetch('/weather?address='+ encodeURI(location) ).then((response)=>{
    response.json().then((data)=>{
        if(data.error){
            // console.log(data.error)
            message1.textContent = data.error
    
        }
        else{
        //     console.log(data.location)
            console.log(data.forecast)
            const temp = `It is ${data.forecast.weather[0].description} and wind speed is ${ data.forecast.wind.speed}
            It feels like ${data.forecast.main.feels_like}\n
            Temperature is ${data.forecast.main.temp}\n
            Humidity is ${data.forecast.main.humidity}\n
            Pressure is ${data.forecast.main.pressure}\n`
            message1.textContent = data.location
            message2.textContent = temp
        }
        
    })
})

})
