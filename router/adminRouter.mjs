import  express  from "express";
import * as controller from "../controller/admin/adminController.mjs"



const router= express.Router(); 




router.route('/adminLogin').post(controller.adminLogin);
router.route('/blockUser/:id').post(controller.blockUser);
router.route('/unBlockUser/:id').post(controller.unBlockUser);


router.route('/allplayer').get(controller.allplayer);
router.route('/allScout').get(controller.allScout);
router.route('/dashbord').get(controller.dashbord)


router.route('/aproved/:id').post(controller.aproved)
router.route('/blockScout/:id').post(controller.pending)



export default router;