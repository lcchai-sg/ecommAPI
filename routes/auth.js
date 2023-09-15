const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSPHRASE
        ).toString(),
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json({ savedUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials !" });
        const hashPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASSPHRASE
        );
        const opassword = hashPassword.toString(CryptoJS.enc.Utf8);
        if (opassword != req.body.password)
            return res.status(401).json({ message: "Invalid credentials !" });
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWTKEY,
            { expiresIn: "1h" }
        );
        const { password, ...others } = user._doc;
        return res.status(200).json({ others, accessToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});
module.exports = router;
