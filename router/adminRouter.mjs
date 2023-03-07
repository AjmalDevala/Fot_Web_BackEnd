import express from "express";
import * as controller from "../controller/admin/adminController.mjs"
import { auth } from "../middleware/auth.mjs";



const router = express.Router();



router.route('/adminLogin').post(controller.adminLogin);
router.route("/verifyAdmin").get(auth, controller.checkAdmin);
router.route('/blockUser/:id').post(auth, controller.blockUser);
router.route('/unBlockUser/:id').post(auth, controller.unBlockUser);


router.route('/allplayer').get(auth, controller.allplayer);
router.route('/allScout').get(auth, controller.allScout);
router.route('/dashbord').get(auth, controller.dashbord)
router.route('/connectedPlayers').get(auth, controller.connectedPlayers)
router.route('/connectedScoutCheck').get(auth, controller.connectedScoutCheck)

router.route('/chart').get(controller.chart)


router.route('/removeUser/:userId').post(auth, controller.removeUser)
router.route('/aproved/:id').post(auth, controller.aproved)
router.route('/blockScout/:id').post(auth, controller.pending)


//message Area
//....................................................................................//
router.route('/getMessage/:user1Id/:user2Id').get(auth, controller.getMessage)
router.route('/connectedScout').post(auth, controller.connectedScout)
router.route('/sendMessage').post(auth, controller.sendMessage)
router.route('/connectedUsers').post(auth, controller.connectedUsers)
router.route('/userUnread').get(auth, controller.unreadUser)
router.route('/scoutUnread').get(auth, controller.unreadScout)

export default router;