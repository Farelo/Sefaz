const crypto = require("crypto")
const key    = require("./constants").encrypt.key;


module.exports = {
   encrypt: encrypt,
   decrypt: decrypt
}

function encrypt(data) {
        let cipher = crypto.createCipher('aes-256-cbc', key);
        let crypted = cipher.update(data, 'utf-8', 'hex');
        crypted += cipher.final('hex');

        return crypted;
}

function decrypt(data) {
        let decipher = crypto.createDecipher('aes-256-cbc', key);
        let decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
}
