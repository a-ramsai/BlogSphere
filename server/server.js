const exp =  require('express');
const app = exp();
require('dotenv').config()
const mongoose = require('mongoose');
const userApp = require('./APIs/userApi');
const authorApp = require('./APIs/authorApi');
const adminApp = require('./APIs/adminApi');
const cors=require('cors');

app.use(cors());


const port = process.env.PORT || 4000;
const frontendUrl='https://blogsphere-aln7.onrender.com'


mongoose.connect(process.env.DBURL)
.then(()=> app.listen(frontendUrl,()=>console.log(`server Listening on port ${port}`)))
.catch(err=>console.log('error in DB',err))


//body passer middleware 
app.use(exp.json());
//conect api routes
app.use('/user-api',userApp);
app.use('/author-api',authorApp);
app.use('/admin-api',adminApp);


app.use((err,req,res,next)=>{
    console.log("err object in exprees handler :",err)
    res.send({message:err.message})
})