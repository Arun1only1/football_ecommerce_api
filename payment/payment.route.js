import express from "express";
import { isBuyer } from "../middleware/authentication.middleware.js";
import axios from "axios";
import { generateRandomString } from "../utils/generate.random.string.js";
import Order from "../order/order.model.js";
import Cart from "../cart/cart.model.js";
import mongoose from "mongoose";

const router = express.Router();

// initiate payment

router.post("/payment/khalti/start", isBuyer, async (req, res) => {
  const { amount, productList } = req.body;
  const purchaseOrderId = generateRandomString();
  try {
    const khaltiResponse = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: "http://localhost:5173/payment/khalti/success/",
        website_url: "http://localhost:5173/",
        amount: Number(amount) * 100, //paisa
        purchase_order_id: purchaseOrderId,
        purchase_order_name: `item-${purchaseOrderId}`,
      },
      {
        headers: {
          Authorization: "key 132661f9aaf04e47868838590e6fe5a1",
          "Content-Type": "application/json",
        },
      }
    );

    await Promise.all(
      productList.map(async (item) => {
        await Order.create({
          buyerId: req.loggedInUserId,
          sellerId: new mongoose.Types.ObjectId(item?.sellerId),
          unitPrice: item?.unitPrice,
          orderedQuantity: item?.orderedQuantity,
          subTotal: item?.subTotal,
          productId: new mongoose.Types.ObjectId(item?.productId),
          paymentStatus: "Initiated",
          pidx: khaltiResponse?.data?.pidx,
        });
      })
    );

    return res
      .status(200)
      .send({ message: "success", paymentDetails: khaltiResponse?.data });
  } catch (error) {
    return res.status(500).send({ message: "Payment initialization failed." });
  }
});

// verify payment
router.post("/payment/khalti/verify", isBuyer, async (req, res) => {
  const { pidx } = req.body;

  //  hit khalti api for lookup payment
  const khaltiResponse = await axios.post(
    "https://a.khalti.com/api/v2/epayment/lookup/",
    {
      pidx,
    },
    {
      headers: {
        Authorization: "key 132661f9aaf04e47868838590e6fe5a1",
        "Content-Type": "application/json",
      },
    }
  );

  await Order.updateMany(
    { pidx },
    {
      $set: {
        paymentStatus: khaltiResponse?.data?.status,
      },
    }
  );

  if (khaltiResponse?.data?.status !== "Completed") {
    return res.status(400).send({ message: "Khalti payment status failed." });
  }

  await Cart.deleteMany({ buyerId: req.loggedInUserId });
  return res.status(200).send({ message: "Khalti payment is successful." });
});
export default router;
