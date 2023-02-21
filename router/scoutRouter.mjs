import  express  from "express";
// get all controller
import * as controller from "../controller/scout/scoutController.mjs"
import { auth } from "../middleware/auth.mjs";
const router= express.Router(); 


// post
router.route('/scoutSignup').post(controller.scoutSignup)
router.route('/scoutLogin').post(controller.scoutLogin)
router.route('/scoutRegister').post(auth,controller.register)
router.route('/editAccount').post(auth,controller.editAccount)
router.route('/editAccount').post(auth,controller.editAccount);



router.route('/showProfile').get(auth,controller.showProfile)
export default router;