import express from "express"
import { changePassword, getAllUsers, login, logout, register, updateProfile } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { singleUpload } from "../middleware/multer.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
// Rotta per l'autenticazione con Google
router.post("/google", google);
router.route("/change-password").put(isAuthenticated, changePassword);
router.route("/logout").get(logout)
router.route("/profile/update").put(isAuthenticated, singleUpload, updateProfile)
// router.route("/all-users").get(getAllUsers);
router.get('/all-users', getAllUsers); //uguale a quella sopra

export default router; 