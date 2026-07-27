const express = require('express');
const protect = require('../middlewares/protect');
const linkController = require('../controllers/linkController');

const router = express.Router();

router.post('/', protect, linkController.createLink);
router.get('/', protect, linkController.getUserLinks);
router.patch('/:id', protect, linkController.updateLink);
router.patch('/:id/status', protect, linkController.updateLinkStatus);
router.delete('/:id', protect, linkController.deleteLink);

module.exports = router;
