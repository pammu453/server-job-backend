import Application from "../models/application.model.js"
import Job from "../models/job.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import cloudinary from "cloudinary"

export const getAllEmployerApplications = async (req, res, next) => {
    const { id, role } = req.user
    try {
        if (role === "Job Seeker") {
            return next(errorHandler(403, "You are not allowed to see a applications."))
        }
        const applications = await Application.find({ "employerId.user": id })
        res.status(200).json({ applications })
    } catch (error) {
        next(error)
    }
}

export const getAllJobSeekerApplications = async (req, res, next) => {
    const { id, role } = req.user
    try {
        if (role === "Employer") {
            return next(errorHandler(403, "You are not allowed to see a applications."))
        }
        const applications = await Application.find({ "applicantId.user": id })
        res.status(200).json({ applications })
    } catch (error) {
        next(error)
    }
}

export const deleteJobseekerApplication = async (req, res, next) => {
    const { role } = req.user
    const { applicationId } = req.params
    try {
        if (role === "Employer") {
            return next(errorHandler(403, "You are not allowed to delete a applications."))
        }
        const application = await Application.findOne({ _id: applicationId })
        if (!application) {
            return next(errorHandler(403, "Application does't exist!"))
        }
        await Application.findByIdAndDelete({ _id: applicationId })
        res.status(200).json({ message: "Application deleted!" })
    } catch (error) {
        next(error)
    }
}

export const postApplication = async (req, res, next) => {
    const { id, role } = req.user
    try {
        if (role === "Employer") {
            return next(errorHandler(403, "You are not allowed to apply to any job!"))
        }
        if (!req.files || Object.keys(req.files).length === 0) {
            return next(errorHandler(403, "Resume file required!"))
        }
        const { resume } = req.files
        const allowedFormats = ['image/png', 'image/jpeg', 'image/webp']
        if (!allowedFormats.includes(resume.mimetype)) {
            return next(errorHandler(403, "Resume must be PNG, JPG, WEBP!"))
        }

        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath);
            var result = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url
            };
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return next(errorHandler(500, "Error uploading image to Cloudinary"));
        }

        const { name, email, coverLetter, phone, address, jobId } = req.body
        const applicantId = {
            user: id,
            role: "Job Seeker"
        }
        const job = await Job.findById(jobId)
        if (!job) {
            return next(errorHandler(404, "Job not found!"))
        }
        const employerId = {
            user: job.postedBy,
            role: "Employer"
        }

        const newApplication = await Application({
            name,
            email,
            coverLetter,
            phone,
            address,
            resume: result,
            applicantId,
            employerId
        }).save()

        res.status(200).json({ application: newApplication, message: "Application submited!" })

    } catch (error) {
        next(error)
    }
}

