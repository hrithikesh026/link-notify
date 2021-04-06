const path = require('path')
const hbs  = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')
const express = require('express')

const app = express()

const port = process.env.PORT || 3000

const publicFilePath = path.join(__dirname,'../public') //To get absolute path to public folder
const viewsPath = path.join(__dirname,'../templates/views') //default is views
const partialsPath = path.join(__dirname,'../templates/partials')

// console.log(publicFilePath)
// console.log(partialsPath)


app.set('view engine', 'hbs')
app.set('views',viewsPath) //not required if views directory is used
hbs.registerPartials(partialsPath)
app.use(express.static(publicFilePath))

app.get('',(req,res)=>{
    res.render('index',{
        title: 'Homepage',
        name: 'Hrithikesh'
    })
})

app.get('/about',(req,res)=>{

    res.render('about',{
        title: 'About Page',
        name: 'Hrithikesh'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title: 'Help Page',
        name: 'Hrithikesh'
    })
})


app.get('/weather', (req,res)=>{
    if(!req.query.address){
        return res.send({
            error: "Address Variable required"
        })
    }
    const Address = req.query.address
    geocode(Address, (error,{latitude,longitude,location} = {})=>{
        if(error){
            return res.send({error})
        }
        forecast(latitude,longitude,(error,forecastData)=>{
            if(error){
                return res.send({error})
            }
            res.send({
                address: req.query.address,
                location: location,
                forecast: forecastData
            })
        })
    })

    
})

app.get('/help/*',(req,res)=>{
    res.render('404notfound',{
        name: 'Hrithikesh',
        error: 404,
        message: 'help article not found'
    })
})

app.get('*', (req,res)=>{
    res.render('404notfound',{
        name: 'Hrithikesh',
        error: 404,
        message: 'Page not found'
    })
})

// app.com
// app.com/help
// app.com/pictures

app.listen(port,()=>{
    console.log('server up and running on port '+ port)
})