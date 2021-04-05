

 


const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const message1 = document.querySelector('#message-1')
const message2 = document.querySelector('#message-2')


weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const location = search.value
    message1.textContent = 'Loading'
    message2.textContent = ''
    fetch('http://localhost:3000/weather?address='+ encodeURI(location) ).then((response)=>{
    response.json().then((data)=>{
        if(data.error){
            // console.log(data.error)
            message1.textContent = data.error
    
        }
        else{
        //     console.log(data.location)
            console.log(data.forecast)
            const temp = 'It is '+data.forecast.weather[0].description+' and wind speed is '+ data.forecast.wind.speed
            message1.textContent = data.location
            message2.textContent = temp
        }
        
    })
})

})