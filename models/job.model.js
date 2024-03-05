import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a job title!"],
        minlength: [3, "Title must be at least 3 characters long!"],
        maxlength: [30, "Title cannot exceed 30 characters!"],
    },
    description: {
        type: String,
        required: [true, "Please provide your job description!"],
        minlength: [3, "Description must be at least 3 characters long!"],
        maxlength: [350, "Description cannot exceed 350 characters!"],
    },
    category: {
        type: String,
        required: [true, "Job category is required!"],
    },
    country: {
        type: String,
        required: [true, "Job country is required!"],
    },
    city: {
        type: String,
        required: [true, "Job city is required!"],
    },
    location: {
        type: String,
        required: [true, "Please provide job location!"],
        minlength: [50, "Location must be at least 50 characters long!"],
    },
    fixedSalary: {
        type: Number,
        min: [1000, "Fixed salary must be at least 1000!"],
        max: [999999999, "Fixed salary cannot exceed 999,999,999!"],
    },
    fromSalary: {
        type: Number,
        min: [1000, "Salary from must be at least 1000!"],
        max: [999999999, "Salary from cannot exceed 999,999,999!"],
    },
    toSalary: {
        type: Number,
        min: [1000, "Salary to must be at least 1000!"],
        max: [999999999, "Salary to cannot exceed 999,999,999!"],
    },
    expired: {
        type: Boolean,
        default: false,
    },
    jobPostedDate: {
        type: Date,
        default: Date.now,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);

export default Job;
