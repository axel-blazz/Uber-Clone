const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Ride = require("../models/ride.model");
const express = require("express");

// Create Order
router.post("/create-order/:rideId", async (req, res) => {
  try {
    const { rideId } = req.params;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: ride.fare * 100, // INR → paise
      currency: "INR",
      receipt: `ride_rcpt_${ride._id}`,
    };

    const order = await instance.orders.create(options);

    // Save order details in ride
    ride.orderId = order.id;
    await ride.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const ride = await Ride.findOne({ orderId: razorpay_order_id });
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (expectedSignature === razorpay_signature) {
      ride.paymentID = razorpay_payment_id;
      ride.signature = razorpay_signature;
      ride.status = "completed"; // or keep separate payment status field if you prefer
      await ride.save();

      return res.json({ success: true, message: "Payment verified" });
    } else {
      ride.status = "cancelled"; // Or "payment_failed"
      await ride.save();
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
});


router.post("/webhook", express.json({ type: "*/*" }), async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest !== req.headers["x-razorpay-signature"]) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = req.body.event;
    if (event === "payment.captured") {
      const { order_id, id: paymentId } = req.body.payload.payment.entity;
      const ride = await Ride.findOne({ orderId: order_id });
      if (ride) {
        ride.paymentID = paymentId;
        ride.status = "completed";
        await ride.save();
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Webhook failed" });
  }
});


module.exports = router;
