require('dotenv').config()
const mongoose = require("mongoose")


const uri=process.env.MONGO_URI

async function dbConnect(){
    try {
        mongoose.set("strictQuery", false);
        const db=await mongoose.connect(uri)
        console.log('connected to', db.connection.name)
    } catch (error) {
        console.log(error)
    }
}
// console.log('hola')
dbConnect()

module.exports = dbConnect 