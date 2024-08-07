const express = require('express')
const app = express()
const db=require('./db')
app.use(express.json())
const path = require('path')
const roomsRoutes = require('./routes/roomsRoute')
const userRoute = require('./routes/userRoute')
const bookingsRoute=require('./routes/bookingsRoute')
const notificationRoute=require('./routes/notificationRoutes')
const taskRoute=require('./routes/taskRoute')
const invoiceRoute =require('./routes/invoiceRoute')
const requestRoute =require('./routes/requestsRoute')
const stockRoute =require('./routes/stocksRoute')

app.use('/api/rooms',roomsRoutes)
app.use('/api/users' , userRoute)
app.use('/api/bookings' , bookingsRoute)
app.use('/api/notifications' , notificationRoute)
app.use('/api/tasks' , taskRoute)
app.use('/api/invoices' , invoiceRoute)
app.use('/api/requests' , requestRoute)
app.use('/api/stocks' , stockRoute)


if(process.env.NODE_ENV ==='production')
{
    app.use('/' , express.static('client/build'))

    app.get('*' , (req , res)=>{

        res.sendFile(path.resolve(__dirname  , 'client/build/index.html'))

    })
}


const port = process.PORT || 5000;

//app.listen(port, () => `Server running on port ${port}`);
app.listen(port, () => console.log(`Node Server Started Using Nodemon`));