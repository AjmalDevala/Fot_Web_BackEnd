import  express  from "express";
import * as controller from "../controller/admin/adminController.mjs"
import { auth } from "../middleware/auth.mjs";



const router= express.Router(); 




router.route('/adminLogin').post(controller.adminLogin);
router.route('/blockUser/:id').post(controller.blockUser);
router.route('/unBlockUser/:id').post(controller.unBlockUser);


router.route('/allplayer').get(controller.allplayer);
router.route('/allScout').get(controller.allScout);
router.route('/dashbord').get(controller.dashbord)


router.route('/aproved/:id').post(controller.aproved)
router.route('/blockScout/:id').post(controller.pending)


//message Area
//....................................................................................//
router.route('/connectedScout').post(auth,controller.connectedScout)
router.route('/sendMessage').post(controller.sendMessage)
router.route('/getMessage').get(controller.getMessage)
router.route('/connectedplayers').get(controller.connectedplayers)
export default router;