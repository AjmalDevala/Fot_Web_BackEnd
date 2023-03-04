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
router.route('/connectPlayer').post(controller.connectPlayer)


router.route('/showProfile').get(auth,controller.showProfile)
router.route('/singlePlayer/:playerId').get(controller.singlePlayer)
router.route('/notification').get(auth,controller.notification)

export default router;