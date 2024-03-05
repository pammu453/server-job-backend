import mongoose from 'mongoose'
import validator from 'validator'

const applicationSchema = new mongoose.Schema({
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
    coverLetter: {
        type: String,
        required: [true, "Please provide your cover letter!"]
    },
    phone: {
        type: String,
        required: [true, "Please provide your phone number!"]
    },
    address: {
        type: String,
        required: [true, "Please provide your address!"]
    },
    resume: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    applicantId: {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        role: {
            type: String,
            enum: ["Job Seeker"],
            required: true,
        }
    },
    employerId: {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        role: {
            type: String,
            enum: ["Employer"],
            required: true,
        }
    },
}, { timestamps: true })

const Application = mongoose.model("Application", applicationSchema)

export default Application