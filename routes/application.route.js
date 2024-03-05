import express from 'express'
import { getAllEmployerApplications ,getAllJobSeekerApplications, deleteJobseekerApplication, postApplication } from '../controllers/application.controllers.js'
import { varifyToken } from '../utils/varifyUser.js'

const router = express.Router()

router.get("/getAllEmployerApplications", varifyToken,getAllEmployerApplications)
router.get("/getAllJobSeekerApplications", varifyToken, getAllJobSeekerApplications)
router.delete("/deleteJobseekerApplication/:applicationId", varifyToken,deleteJobseekerApplication)
router.post("/postApplication", varifyToken,postApplication)

export default router