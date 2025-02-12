require('dotenv').config();
const express = require("express");
const cors = require('cors')
const app = express();
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const categoriesRoute = require('./routes/categoriesRoutes');
const coursesRoute = require('./routes/coursesRoutes');
const inquiryRoute = require('./routes/inquiryRoutes');
const enrollmentRoute = require('./routes/enrollmentRoutes')
const studentRoutes = require('./routes/studentRoutes')
const CheckUser = require('./routes/CheckUser/isLoggedIn')
const subscribeRoutes = require('./routes/subscribeRoutes')
const dashborad = require('./routes/dashboard')
const offers = require('./routes/offers')

const allowedOrigins = ["http://18.132.41.132:5173", "http://18.132.41.132:5174"];

app.use(cors({
    origin: (origin, callback) => {
        // console.log(origin)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); 
        } else {
            callback(new Error('Not allowed by CORS')); 
        }
    },
    credentials: true, 
}));


app.use(cookieParser())
app.use(express.json());

mongoose.connect(process.env.DATABASE_URI).then(result => {
    const port = process.env.PORT || 3000
    app.listen(port,'0.0.0.0', () => {
        console.log("connected to mongoose");
        console.log(`app listenning on port ${port}`);
    });
}).catch(err => {
    console.log(err);
});



// 1. categories
app.use('/categories', categoriesRoute);

// 2. courses
app.use('/courses', coursesRoute);

// 3.  inquiries
app.use('/inquiries', inquiryRoute);

// 4. enrollments
app.use('/enrollments', enrollmentRoute);

// 5. students
app.use('/student', studentRoutes);

// 6. check user session
app.use('/checkSession', CheckUser);

app.use('/subscription', subscribeRoutes)

app.use('/dashboard', dashborad)

app.use('/offers', offers)


app.get('/healthCheck', (req, res) => {
    res.status(200).json({msg: "Healthy....."})
})