import express  from "express";
import  cors  from "cors";
import morgan from "morgan";
import connect from "./database/connect.mjs";
import playerRoute from "./router/playerRouter.mjs"
import adminRoute from "./router/adminRouter.mjs";
import scoutRoute from "./router/scoutrouter.mjs";
const app = express();

app.use(express.json());
app.use(cors())
app.use(morgan('tiny'));
app.disable('x-powered-by'); //less hackers know about our stack 



// app.get('/',(req,res)=>{
//     res.status(201).json("home")
// });


//API for Admin,player,scout

app.use('/api/',playerRoute)
app.use('/api/admin',adminRoute)
app.use('/api/scout',scoutRoute)



//  start server only when we have valid connections

const port=7007;
connect().then(()=>{
    try {
        app.listen(port,()=>{
            console.log(`server connected to http://localhost:${port}`);
        })
        
    } catch (error) {
        console.log('connot connect to the server');
        
    }
}).catch(error=>{
    console.log('Invalid Database Connection...!')
}) 


