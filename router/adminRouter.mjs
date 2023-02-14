import  express  from "express";
import * as controller from "../controller/admin/adminController.mjs"



const router= express.Router(); 




router.route('/adminLogin').post(controller.adminLogin);
// router.route('/adminLogin').post(controller.adminLogin);




export default router;