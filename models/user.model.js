import mongoose from 'mongoose'
import validator from 'validator'


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name!"],
        minLength: [3, "Name must contain at least 3 characters!"],
        maxLength: [20, "Name cannot exceed 20 characters!"],
    },
    email: {
        type: String,
        required: [true, "Please provide  your email!"],
        validate: [validator.isEmail, "Please provide your correct email"]
    },
    phone: {
        type: Number,
        required: [true, "Please provide your phone number"]
    },
    password: {
        type: String,
        required: [true, "Please provide your name!"],
        minLength: [3, "Password must contain at least 8 characters!"],
    },
    role: {
        type: String,
        required: [true, "Please provide your role"],
        enum: ['Job Seeker', 'Employer'],
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)


export default User