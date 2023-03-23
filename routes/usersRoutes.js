import express from "express";

import {
    getUsers,
    createUser,
    getUser,
    deleteUser,
    getUserByQuery,

} from "../controllers/usersController.js";

// import advancedResults from '../middleware/advancedResults.js';

const router = express.Router({ mergeParams: true });

router.route("/").get(getUsers).post(createUser);

router.route("/getUserByQuery").get(getUserByQuery);

router.route("/:id").get(getUser).delete(deleteUser);

export default router;