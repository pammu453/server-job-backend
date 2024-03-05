import express from 'express'
import {getAllJobs,getMyJobs,postNewJob,updateJob,deleteJob} from '../controllers/job.controllers.js'
import { varifyToken } from '../utils/varifyUser.js'

const router = express.Router()

router.get("/getAllJobs",getAllJobs)
router.post("/postNewJob",varifyToken,postNewJob)
router.get("/getMyJobs",varifyToken,getMyJobs)
router.put("/updateJob/:jobId",varifyToken,updateJob)
router.delete("/deleteJob/:jobId",varifyToken,deleteJob)

export default router