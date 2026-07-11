import { createContext, useContext, useEffect, useState } from "react";
import { getJobCards } from "../../production-planning/services/productionApi";

const JobCardContext = createContext();

export const JobCardProvider = ({ children }) => {
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobCards = async () => {
    try {
      setLoading(true);

      const data = await getJobCards();

      setJobCards(data);
    } catch (error) {
      console.error("Error fetching Job Cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshJobCards = async () => {
    await fetchJobCards();
  };

  useEffect(() => {
    fetchJobCards();
  }, []);

  return (
    <JobCardContext.Provider
      value={{
        jobCards,
        loading,
        refreshJobCards,
      }}
    >
      {children}
    </JobCardContext.Provider>
  );
};

export const useJobCardContext = () => {
  const context = useContext(JobCardContext);

  if (!context) {
    throw new Error("useJobCardContext must be used inside JobCardProvider");
  }

  return context;
};
