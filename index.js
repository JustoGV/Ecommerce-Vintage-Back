require('dotenv').config()

const app=require('./src/App')
const PORT= process.env.PORT || 4200

require('./src/mongodb')

app.listen(PORT,()=>{
    console.log('Server on port',PORT)
}) 