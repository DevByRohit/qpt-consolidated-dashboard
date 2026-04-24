import { createContext, useContext, useEffect, useState } from "react";
import { IN_OUT_API } from "../../apiContainer";
const MasterDataContext = createContext();

export const MasterDataProvider = ({ children }) => {
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMasterData = async () => {
    try {
      const res = await fetch(IN_OUT_API, {
        method: "POST",
        body: JSON.stringify({
          action: "getMasterData",
        }),
      });

      const result = await res.json();

      if (result.status === "success") {
        setMasterData(result.data);
      }
    } catch (err) {
      console.error("Error fetching master data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData(); // ✅ only once
  }, []);

  return (
    <MasterDataContext.Provider
      value={{ masterData, loading, fetchMasterData }}
    >
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => useContext(MasterDataContext);
