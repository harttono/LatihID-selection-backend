import express from 'express'
import config from './config';
import dotenv from 'dotenv';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import shortid from 'shortid';

dotenv.config();

const app = express();
app.use(bodyparser.json());

// make connection config
const mongodbUrl = config.MONGODB_URL
mongoose.connect(mongodbUrl,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch( error => console.log(error.reason));


// make model user
const User = mongoose.model(
    'users',
    new mongoose.Schema({
        _id:{type:String,default:shortid.generate},
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true,dropDups:true},
        phone:{type:Number,required:true},
        job:{type:String,required:true}
    })
)

// list of endpoint

app.post("/api/users",async(req,res) =>{
    try{
     const user = new User({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            job:req.body.job
        })
        const newUser = await user.save();
        if(newUser){
            res.send({message:'Penyimpanan data berhasil dilakukan !'})
        }
    }catch(error){
        res.send({message:error})
    }
})

app.get("/api/users/:id",async(req,res) =>{
    const UserId = req.params.id;
    const newUser = await User.findOne({_id:UserId});
    if (newUser){
      res.send(newUser)
    }else{
      res.status(404).send({message:`User with id ${UserId} not found.`})
    }
})

app.get("/api/users",async(req,res) =>{
    const user = await User.find({});
    res.send(user)
})


app.listen(config.PORT,()=>{
    console.log(`server started at http://localhost:${config.PORT}`)
})