const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");
const User = require("../models/user");

const router = require("express").Router();

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSPHRASE
        ).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
});

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
});

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json({ user: others });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().limit(5) : await User.find();
        const usrs = users
            ? users.map((x) => {
                  let { password, ...others } = x._doc;
                  return others;
              })
            : users;
        res.status(200).json({ users: usrs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
});

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
});

module.exports = router;
