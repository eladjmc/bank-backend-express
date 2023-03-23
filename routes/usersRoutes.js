import express from 'express';
import {
  getUsers,
  createUser,
} from '../controllers/usersController.js';
// import advancedResults from '../middleware/advancedResults.js';
// import Shop from '../models/Shop.js';


// Include other resource routers
const router = express.Router();


router
  .route('/').get(getUsers).post(createUser);
  // .get(advancedResults(Shop, 'products'), getUsers)

router
  .route('/:id')
  .get(getShop)
  .put(updateShop)
  .delete(deleteShop);

export default router;