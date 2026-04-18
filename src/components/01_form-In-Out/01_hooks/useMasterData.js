import { useEffect, useState } from "react";
import { IN_OUT_API } from "../../constant";

const useMasterData = () => {
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMasterData = async () => {
    try {
      const res = await fetch(IN_OUT_API);
      const result = await res.json();

      if (result.status === "success") {
        setMasterData(result.data);
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error("Error fetching master data", err);
      alert("Failed to fetch master data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  return { masterData, loading };
};

export default useMasterData;
