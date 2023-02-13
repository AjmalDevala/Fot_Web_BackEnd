import  express  from "express";
// get all controller
import * as controller from "../controller/player/playerController.mjs"
// import { localVariables } from "../middleware/auth.js";
const router= express.Router(); 


// post

router.route('/userSignup').post(controller.userSignup)
router.route('/sendOtp').post(controller.sendOtp);
router.route('/resendotp').get(controller.resendotp);

//get 
router.route('/userLogin').post(controller.userLogin)




export default router;