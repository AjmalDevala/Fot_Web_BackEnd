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
router.route('/connectedPlayers').get(controller.connectedPlayers)
router.route('/connectedScoutCheck').get(controller.connectedScoutCheck)

router.route('/chart').get(controller.chart)


router.route('/removeUser/:userId').post(auth,controller.removeUser)
router.route('/aproved/:id').post(controller.aproved)
router.route('/blockScout/:id').post(controller.pending)


//message Area
//....................................................................................//
router.route('/getMessage/:user1Id/:user2Id').get(controller.getMessage)
router.route('/connectedScout').post(auth,controller.connectedScout)
router.route('/sendMessage').post(auth,controller.sendMessage)
router.route('/connectedUsers').post(auth,controller.connectedUsers)
router.route('/userUnread/:userId').get(controller.unreadUser)
router.route('/scoutUnread/:scoutId').get(controller.unreadScout)

export default router;