const express = require('express');
const protect = require('../middlewares/protect');
const linkController = require('../controllers/linkController');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.post('/', protect, linkController.createLink);
router.get('/', protect, linkController.getUserLinks);
router.get('/:id/analytics', protect, analyticsController.getLinkAnalytics);
router.patch('/:id', protect, linkController.updateLink);
router.patch('/:id/status', protect, linkController.updateLinkStatus);
router.delete('/:id', protect, linkController.deleteLink);

module.exports = router;
