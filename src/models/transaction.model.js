const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must have a fromAccount"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must have a toAccount"],
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        message:
          "Status must be either pending, completed, failed, or reversed",
      },
      default: "PENDING",
    },

    amount: {
      type: Number,
      required: [true, "Transaction must have an amount"],
      min: [0, "Transaction amount must be a positive number"],
    },
    idempotencyKey: {
      type: String,
      required: [true, "Transaction must have an idempotency key"],
      index: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;
