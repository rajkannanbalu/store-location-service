'use strict'

import { Router } from 'express';
import StoreController from '../controllers/StoreController';

const router = Router();



router.get('/', StoreController.getNearestStore);
router.post('/', StoreController.addStore);
router.put('/:id', StoreController.updateStore);
router.get('/all', StoreController.getAllStores);
router.delete('/:id', StoreController.deleteStore);


export default router;