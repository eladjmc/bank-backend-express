import express from "express";
import {
  getAccounts,
  createAccount,
  deleteAccount,
  getAccount,
  getAccountByQuery,
  updateBalance,
} from "../controllers/accountsController.js";

// Include other resource routers
const router = express.Router();

router.route("/").get(getAccounts).post(createAccount);

router.route("/getAccountByQuery").get(getAccountByQuery);

router.route("/updateBalance/:id").put(updateBalance);

router.route("/:id").delete(deleteAccount).get(getAccount);


export default router;
