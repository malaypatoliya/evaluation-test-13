const express = require('express');
const APIResponseFormat = require('../utils/APIResponseFormat');
const { _doEncrypt, _doDecrypt } = require('../utils/encryption.js');
const demoRoutes = require('../routes/demo/demoRoutes');

const router = express.Router();

router.use('/demo', demoRoutes);

// For Encryption
router.get('/encryption', (req, res) => {
    const id = req.header('id');
    if (id) {
        const encryptedId = _doEncrypt(id);
        return APIResponseFormat._ResDataFound(res, encryptedId);
    } else {
        return APIResponseFormat._ResMissingRequiredField(res, "Id is required");
    }
});

// For Decryption
router.get('/decryption', (req, res) => {
    const id = req.header('id');
    if (id) {
        const decryptedId = _doDecrypt(id);
        return APIResponseFormat._ResDataFound(res, decryptedId);
    } else {
        return APIResponseFormat._ResMissingRequiredField(res, "Id is required");
    }
});

router.get("/", (req, res) => {
    return APIResponseFormat._ResDataFound(res, "Welcome to the Bioler Plate Of NodeJS API");
});

router.use('*', (req, res) => {
    return APIResponseFormat._ResRouteNotFound(res);
});

const setRoutes = (app) => {
    app.use('/api/v1', router);
}

module.exports = setRoutes;