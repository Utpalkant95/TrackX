import express from "express";
import {
  checkAuth,
  eraseAccount,
  login,
  logOut,
  register,
  updatePassword,
} from "../controller/auth.controller";
import isAuthenticated from "../middlewares/isAuthenticated";
const AuthRouter = express.Router();

AuthRouter.route("/register").post(register);
AuthRouter.route("/login").post(login);
AuthRouter.route("/logout").get(isAuthenticated, logOut);
AuthRouter.route("/check-auth").get(checkAuth);
AuthRouter.route("/update-password").put(isAuthenticated, updatePassword);
AuthRouter.route("/erase-account").delete(isAuthenticated, eraseAccount);

export default AuthRouter;