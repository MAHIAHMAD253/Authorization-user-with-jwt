const express = require('express')
const morgan = require('morgan')
const userRouter = require('./router/user')
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();


const dbConnect = require('./utils/connection')


dbConnect()
.then(() => {
    console.log("mongodb is connect");
}).catch((err) => {
    console.log(err.message);
})


const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));


app.use("/user",userRouter)



const port = process.env.PORT || 5001
const host = process.env.HOST || localhost






app.listen(port,host, () => {
    console.log('connecting....')
});