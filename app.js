require('dotenv').config();
require('express-async-errors');

//extra security
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")

//express
const express = require('express');
const app = express();

//connection
const connectDB = require("./db/connect")

//routers
const authRouter = require("./routes/auth")
const jobsRouter = require("./routes/jobs")

//authentication
const authenticateUser = require("./middleware/authentication")

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set("trustProxy", 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false
  })
)

app.use(helmet())
app.use(cors())
app.use(xss())

app.use(express.json());

// routes
app.get("/", (req,res) => {
  res.send("Jobs API")
})
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authenticateUser, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//port
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => console.log(`Server is listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
};

start();
