import { useEffect, useRef, useState } from "react";
import { IN_OUT_API } from "../../apiContainer";

const cache = {}; // 🔥 global cache

const useTransactions = (selectedDate) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  const dateKey = selectedDate.toISOString().split("T")[0];

  const fetchTransactions = async (force = false) => {
    try {
      // use cache
      if (!force && cache[dateKey]) {
        setTransactions(cache[dateKey]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const res = await fetch(IN_OUT_API, {
        method: "POST",
        body: JSON.stringify({
          action: "getTransactions",
          date: dateKey,
        }),
      });

      const result = await res.json();

      console.log("Transactions:", result);

      if (result.status === "success") {
        setTransactions(result.data);
        cache[dateKey] = result.data; // store cache
      }
    } catch (err) {
      console.error("Error fetching transactions", err);
    } finally {
      setLoading(false);
    }
  };

  // ONLY FIRST TIME
  useEffect(() => {
    if (!hasFetched.current) {
      fetchTransactions();
      hasFetched.current = true;
    }
  }, []);

  return { transactions, loading, fetchTransactions };
};

export default useTransactions;
