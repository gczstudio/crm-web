const express = require('express');
const router = express.Router();
require('./common')(router);
require('./lowcode')(router);
module.exports = router;