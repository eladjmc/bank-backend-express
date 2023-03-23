import express from "express";
import {
  getUsers,
  createUser,
  deleteUser,
  getUser,
  getUserByQuery,
  updateBalance,
} from "../controllers/usersController.js";

// Include other resource routers
const router = express.Router();

router.route("/").get(getUsers).post(createUser);

router.route("/getUserByQuery").get(getUserByQuery);

router.route("/updateBalance/:id").put(updateBalance);

router.route("/:id").delete(deleteUser).get(getUser);


export default router;
