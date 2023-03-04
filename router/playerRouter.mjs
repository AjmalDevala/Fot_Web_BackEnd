import  express  from "express";
import * as controller from "../controller/player/playerController.mjs"
import { auth } from "../middleware/auth.mjs";
const router= express.Router(); 


// post

router.route('/userSignup').post(controller.userSignup);
router.route('/userLogin').post(controller.userLogin)
router.route('/sendOtp').post(controller.sendOtp);
router.route('/connectScout').post(controller.connectScout)
router.route('/editProfile/:userId').post(auth,controller.profile);
router.route('/premiumPlayer/:userId').post(controller.premiumPlayer)
router.route("/verifyUser").get(auth,controller.checkUser);

//get 

router.route('/resendotp').get(controller.resendOtp)
router.route('/showProfile').get(auth,controller.showProfile)
router.route('/singleScout/:scoutId').get(controller.singleScout)

export default router;