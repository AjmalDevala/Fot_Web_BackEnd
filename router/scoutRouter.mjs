import  express  from "express";
// get all controller
import * as controller from "../controller/scout/scoutController.mjs"
const router= express.Router(); 


// post

router.route('/scoutSignup').post(controller.scoutSignup)

//get 
router.route('/scoutLogin').post(controller.scoutLogin)




export default router;