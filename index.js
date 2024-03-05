import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import { v2 as cloudinary } from 'cloudinary'
dotenv.config()

import userRouter from "./routes/user.route.js"
import jobRouter from './routes/job.route.js'
import applicationRouter from './routes/application.route.js'

import db from "./database/dbConection.js"

import errorMiddleware from './middleware/errorMiddleware.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

app.use('/api/user', userRouter)
app.use('/api/job', jobRouter)
app.use('/api/application', applicationRouter)


db()

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`)
})

app.use(errorMiddleware)