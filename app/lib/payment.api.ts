// lib/payment.api.ts
import { api } from "./axios";

export const getPaymentLink = async () => {
  // HAPUS headers: { Authorization... } DARI SINI CUK!
  // Biar axios.ts yang urus tokennya.
  const res = await api.post("/payment/link", {}); 
  return res.data;
};

export const checkPaymentStatus = async () => {
  // INI JUGA, JANGAN ADA HEADER MANUAL LAGI
  const res = await api.get("/payment/check-status");
  return res.data;
};