"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const usePollPaymentStatus = (sessionId: string) => {
  const router = useRouter();
  const [isPaid, setIsPaid] = useState(false);

  const { data } = useQuery({
    queryKey: ["paymentStatus", sessionId, isPaid],
    queryFn: async () => {
      const response = await fetch(`/api/checkout?session_id=${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch payment status");
      return response.json();
    },
    refetchInterval: isPaid ? false : 2000, // Poll until payment is confirmed
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (data?.isPaid) {
      setIsPaid(true);
      router.refresh();
    }
  }, [data?.isPaid, router]);

  return { isPaid, isLoading: !data && !isPaid };
};

export default usePollPaymentStatus;
