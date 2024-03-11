const mongoose= require('mongoose')
const dotenv = require('dotenv');

dotenv.config();

async function dbConnect() {
    await mongoose.connect(
        process.env.MONGODB_URI
    );
}

module.exports = dbConnect;