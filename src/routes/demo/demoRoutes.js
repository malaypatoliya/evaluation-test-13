const express = require('express');
const demoContoller = require('../../controllers/demo/demoContoller');

const router = express.Router();

router.get('/', demoContoller.demo);
router.post('/', demoContoller.addDemo);
router.put('/', demoContoller.updateDemo);
router.delete('/', demoContoller.deleteDemo);

module.exports = router;