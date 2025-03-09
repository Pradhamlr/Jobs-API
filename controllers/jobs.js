const Job = require("../models/Job")
const { StatusCodes } = require("http-status-codes")
const {BadRequestError, NotFoundError} = require("../errors")

const getAllJobs = async (req,res) => {
    const {user: {userId}} = req
    const jobs = await Job.find({ createdBy: userId}).sort("createdAt")
    res.status(StatusCodes.OK).json({ count: jobs.length, jobs })
}

const getJob = async (req,res) => {
    const {params: {id: jobID}, user: {userId}} = req
    const job = await Job.findOne({ createdBy: userId, _id: jobID})
    if(!job) {
        throw new NotFoundError(`Job Not Found With Id: ${jobID}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req,res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create({...req.body})
    res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req,res) => {
    const {body: {company, position}, params: {id: jobID}, user: {userId}} = req

    if(company === "" || position === "") {
        throw new BadRequestError("Company Or Position Cannot Be Empty")
    }

    const job = await Job.findOneAndUpdate({ createdBy: userId, _id: jobID}, req.body, {
        new: true,
        runValidators: true
    })
    if(!job) {
        throw new NotFoundError(`Job Not Found With Id: ${jobID}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req,res) => {
    const {user: {userId}, params: {id: jobID}} = req
    const job = await Job.findOneAndDelete({ createdBy: userId, _id: jobID})
    if(!job) {
        throw new NotFoundError(`Job Not Found With Id: ${jobID}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}