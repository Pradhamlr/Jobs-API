const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "Please Provide Company"],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, "Please Provide Position"],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ["Interview", "Declined", "Pending"],
        default: "Pending"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please Provide User"]
    }
}, {timestamps: true})

module.exports = mongoose.model("Job", jobSchema)