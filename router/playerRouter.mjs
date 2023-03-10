import express from "express";
import * as controller from "../controller/player/playerController.mjs";
import { auth } from "../middleware/auth.mjs";
const router = express.Router();

// Authenticaton login and token setup
router.route("/userSignup").post(controller.userSignup);
router.route("/sendOtp").post(controller.sendOtp);
router.route("/resendotp").get(controller.resendOtp);
router.route("/userLogin").post(controller.userLogin);

router.route("/connectScout").post(auth, controller.connectScout);
router.route("/editProfile").post(auth, controller.profile);
router.route("/premiumPlayer").post(auth, controller.premiumPlayer);
router.route("/verifyUser").get(auth, controller.checkUser);
router.route("/showProfile").get(auth, controller.showProfile);
router.route("/singleScout/:scoutId").get(auth, controller.singleScout);
router.route('/editAccount').post(auth,controller.editAccount)
router.route('/gallery').post(auth,controller.gallery)
router.route('/pohotoDelete').post(auth,controller.pohotoDelete)

export default router;
