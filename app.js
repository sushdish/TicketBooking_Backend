require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const tripsRoutes = require("./routes/trips");
const stripeRoutes = require("./routes/stripepayment");
const braintreeRoutes = require("./routes/braintree");
const bookingRoutes = require("./routes/booking")
const cancellationRoutes = require("./routes/cancellation")
const refundRoutes = require("./routes/refund")
const configRoutes = require("./routes/config")
const walletRoutes = require("./routes/wallet")
const offerRoutes = require("./routes/offer")

const PORT = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(`ERR: ${err}`);
  });

// My routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tripsRoutes);
app.use("/api", stripeRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", bookingRoutes);
app.use("/api", cancellationRoutes);
app.use("/api", refundRoutes)
app.use("/api", configRoutes);
app.use("/api", walletRoutes);
app.use("/api", offerRoutes)

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
