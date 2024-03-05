import Job from "../models/job.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ expired: false })
        res.status(200).json(jobs)
    } catch (error) {
        next(error)
    }
}

export const postNewJob = async (req, res, next) => {
    try {
        const { title, description, category, country, city, location, fixedSalary, fromSalary, toSalary } = req.body;
        const { role } = req.user
        if (role === "Job Seeker") {
            return next(errorHandler(403, "You are not allowed to post a job."))
        }
        if (!title || !description || !category || !country || !city || !location) {
            return next(errorHandler(400, "Please provide all required details to post a job"))
        }
        if (!(fromSalary && toSalary) && !fixedSalary) {
            return next(errorHandler(400, "Please provide salary range or fixed salary!!"));
        }
        if ((fromSalary !== undefined && toSalary !== undefined) && (fromSalary > toSalary)) {
            return next(errorHandler(400, "The salary range is invalid. Salary from must be less than Salary to."));
        }
        if ((fromSalary && toSalary) && fixedSalary) {
            return next(errorHandler(400, "Please provide salary range or fixed salary!"));
        }
        if ((fixedSalary && (fromSalary || toSalary))) {
            return next(errorHandler(400, "Please provide either a fixed salary or a salary range."));
        }
        const postedBy = req.user.id
        const newJob = await Job({ title, description, category, country, city, location, fixedSalary, fromSalary, toSalary, postedBy }).save()

        res.status(200).json({ newJob, message: 'New job created  successfully!' });

    } catch (error) {
        next(error)
    }
}

export const getMyJobs = async (req, res, next) => {
    const { id, role } = req.user
    try {
        if (role === "Job Seeker") {
            return next(errorHandler(403, "You are not allowed to post a job."))
        }
        const myjobs = await Job.find({ postedBy: id })
        res.status(200).json(myjobs);
    } catch (error) {
        next(error)
    }
}

export const updateJob = async (req, res, next) => {
    const { id, role } = req.user
    const { jobId } = req.params
    const { fixedSalary, fromSalary, toSalary } = req.body;
    try {
        if (role === "Job Seeker") {
            return next(errorHandler(403, "You are not allowed to post a job."))
        }
        let job = await Job.findById(jobId)

        if (!job) {
            return next(errorHandler(404, "Job not found!"))
        }

        if (id !== job.postedBy.toHexString()) {
            return next(errorHandler(403, "You are not owner of the job"))
        }

        if (fromSalary || toSalary || fixedSalary) {
            if (!(fromSalary && toSalary) && !fixedSalary) {
                return next(errorHandler(400, "Please provide salary range or fixed salary!!"));
            }
            if ((fromSalary !== undefined && toSalary !== undefined) && (fromSalary > toSalary)) {
                return next(errorHandler(400, "The salary range is invalid. Salary from must be less than Salary to."));
            }
            if ((fromSalary && toSalary) && fixedSalary) {
                return next(errorHandler(400, "Please provide salary range or fixed salary!"));
            }
            if ((fixedSalary && (fromSalary || toSalary))) {
                return next(errorHandler(400, "Please provide either a fixed salary or a salary range."));
            }
        }
        if (fromSalary && toSalary) {
            req.body.fixedSalary = null
        } if (fixedSalary) {
            req.body.fromSalary = null
            req.body.toSalary = null
        }

        job = await Job.findByIdAndUpdate(jobId, req.body, { new: true })

        res.status(200).json({ updatedJob: job, message: "Job updated!" });
    } catch (error) {
        next(error)
    }
}

export const deleteJob = async (req, res, next) => {
    const { id, role } = req.user
    const { jobId } = req.params
    try {
        if (role === "Job Seeker") {
            return next(errorHandler(403, "You are not allowed to delete a job."))
        }
        let job = await Job.findById(jobId)

        if (!job) {
            return next(errorHandler(404, "Job not found!"))
        }

        if (id !== job.postedBy.toHexString()) {
            return next(errorHandler(403, "You are not owner of the job"))
        }

        await Job.findByIdAndDelete(jobId)

        res.status(200).json({ message: "Job deleted!" });
    } catch (error) {
        next(error)
    }
}