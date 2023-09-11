const CryptoJS = require("crypto-js");
const password = "123456";
const dotenv = require("dotenv");

dotenv.config();
console.log(process.env.PASSPHRASE);
const hashPassword = CryptoJS.AES.encrypt(password, process.env.PASSPHRASE).toString();
console.log("hashed : ", hashPassword);

const dpass = CryptoJS.AES.decrypt(hashPassword, process.env.PASSPHRASE);
const ddpass = dpass.toString(CryptoJS.enc.Utf8);
console.log('decrypt : ', ddpass, typeof ddpass, ddpass.length);
console.log('password : ', password, typeof password, password.length);

if (ddpass !== password) console.log('INCORRECT!'); else console.log('CORRECT');