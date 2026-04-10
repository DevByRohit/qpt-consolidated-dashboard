import { createContext, useContext, useEffect, useState } from "react";

const CardContext = createContext();

const API_URL =
  "https://script.google.com/macros/s/AKfycbzwbyEVzFVowbjK0VAFcq3buB1vCLWty3inW_KrDoiy1LpLwnUvLwv5g54r6Q1219NGPQ/exec";

export const CardProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    try {
      const res = await fetch(API_URL);
      const result = await res.json();

      if (result.status === "success") {
        setCards(result.data);
      }
    } catch (err) {
      console.error("Error fetching cards", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(); // ✅ only once
  }, []);

  return (
    <CardContext.Provider value={{ cards, loading, fetchCards }}>
      {children}
    </CardContext.Provider>
  );
};

// custom hook
export const useCards = () => useContext(CardContext);
