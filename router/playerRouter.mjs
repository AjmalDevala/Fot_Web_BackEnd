import  express  from "express";
import * as controller from "../controller/player/playerController.mjs"
import { auth } from "../middleware/auth.mjs";
const router= express.Router(); 


// post

router.route('/userSignup').post(controller.userSignup);
router.route('/userLogin').post(controller.userLogin)
router.route('/sendOtp').post(controller.sendOtp);

//get 

router.route('/resendotp').get(controller.resendOtp)
router.route('/showProfile').get(auth,controller.showProfile)
router.route('/editProfile/:userId').post(auth,controller.profile);



export default router;