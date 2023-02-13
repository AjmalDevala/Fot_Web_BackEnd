import express  from "express";
import  cors  from "cors";
import morgan from "morgan";
import 'dotenv/config'
import mongoose from 'mongoose'
import createHttpError , {isHttpError} from 'http-errors';
import playerRoute from "./router/playerRouter.mjs"
import adminRoute from "./router/adminRouter.mjs";
import scoutRoute from "./router/scoutrouter.mjs";
const app = express();


app.use(express.json());
app.use(cors())
app.use(morgan('tiny'));
app.disable('x-powered-by'); //less hackers know about our stack 




//API for Admin,player,scout

app.use('/api',playerRoute)
app.use('/api/scout',scoutRoute)
app.use('/api/admin',adminRoute)

// error handiling  

app.use((req,res,next)=>{
    next(createHttpError(404,"Endpoint not found"))
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error,req,res,next)=>{
    console.log(error);
    let errorMessage = "An unknown error occured"
    let statusCode = 500;
    if(isHttpError(error)){
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({error : errorMessage})
})





//  start server only when we have valid connections

const port = process.env.PORT
mongoose.connect(process.env.MONGO_CONNECTION).then(()=>{
    try {
        app.listen(port,()=>{
            console.log(`server&database connected to http://localhost:${port}`);
        })
        
    } catch (error) {
        console.log('connot connect to the server');
         
    }
}).catch(error=>{
    console.log('Invalid Database Connection...!')
}) 


