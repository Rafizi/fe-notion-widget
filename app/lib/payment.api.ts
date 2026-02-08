// lib/payment.api.ts
import { api } from "./axios";

export const getPaymentLink = async () => {
  // Post data kosong {} karena BE cuma butuh info user dari token
  const res = await api.post("/payment/link", {});
  return res.data;
};

export const checkPaymentStatus = async () => {
  const res = await api.get("/payment/check-status");
  return res.data;
};