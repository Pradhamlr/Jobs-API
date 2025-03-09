const express = require("express")
const router = express.Router()

const {getJob,deleteJob,updateJob,createJob,getAllJobs} = require("../controllers/jobs")
//used in app.js directly
const authMiddleware = require("../middleware/authentication")


router.route("/").get(getAllJobs).post(createJob)
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob)

module.exports = router