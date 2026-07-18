const express = require('express');
const linkController = require('../controllers/linkController');

const router = express.Router();

router.get('/:shortCode', linkController.redirectToOriginalUrl);

module.exports = router;
