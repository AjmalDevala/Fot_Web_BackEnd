import  express  from "express";
import login from '../controller/playerController.mjs'

const router= express.Router(); 


// post
router.route('/Signup').post()
router.route('/login').get(login)



//get

router.route('/home').post()
export default router;