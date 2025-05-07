"use client";

import usePollPaymentStatus from "@/hooks/use-poll-payment-status";

const PaymentStatus = ({ sessionId }: { sessionId: string }) => {
  const { isPaid, isLoading } = usePollPaymentStatus(sessionId);

  if (isLoading) return <p>Checking payment status...</p>;
  if (isPaid) return <p>Payment successful! Redirecting...</p>;

  return <p>Waiting for payment...</p>;
};

export default PaymentStatus;
