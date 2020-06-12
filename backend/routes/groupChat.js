const express = require('express');
const router = express.Router();
const GroupChat = require('../models/groupChat');
const verify = require('../authentication');

router.get('/', verify, (req, res) => {

})

router.post('/', verify, (req, res) => {
    
})

module.exports = router