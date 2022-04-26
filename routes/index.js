const express = require('express');
const path = require('path');
const router = 	express();
const bodyParser = require('body-parser');
const { dirname } = require('path');

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});

router.post('/', (req,res)=>{
    var password=req.body.password;
    res.redirect(path.join(password));
});

router.get('/Password',(req,res)=>{
    res.sendFile(path.join(__dirname,'../index.html'));
});

router.get('/*',(req,res) =>{
    res.sendFile(path.join(__dirname,'../adgangur_ohemill.html'));
    
});

module.exports = router;