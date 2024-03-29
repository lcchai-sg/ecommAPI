const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to Mongo DB"))
    .catch((error) => console.log(error));

app.use("/api/auth/", authRoute);
app.use("/api/users/", userRoute);

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
