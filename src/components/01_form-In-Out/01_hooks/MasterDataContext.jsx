// import { createContext, useContext, useEffect, useState } from "react";
// import { IN_OUT_API } from "../../apiContainer";
// const MasterDataContext = createContext();

// export const MasterDataProvider = ({ children }) => {
//   const [masterData, setMasterData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchMasterData = async () => {
//     try {
//       const res = await fetch(IN_OUT_API, {
//         method: "POST",
//         body: JSON.stringify({
//           action: "getMasterData",
//         }),
//       });

//       const result = await res.json();

//       if (result.status === "success") {
//         setMasterData(result.data);
//       }
//     } catch (err) {
//       console.error("Error fetching master data", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMasterData(); // ✅ only once
//   }, []);

//   return (
//     <MasterDataContext.Provider
//       value={{ masterData, loading, fetchMasterData }}
//     >
//       {children}
//     </MasterDataContext.Provider>
//   );
// };

// export const useMasterData = () => useContext(MasterDataContext);

import { createContext, useContext, useEffect, useState } from "react";
import { IN_OUT_API } from "../../apiContainer";

const MasterDataContext = createContext();

export const MasterDataProvider = ({ children }) => {
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch master data from Google Apps Script.
   *
   * We intentionally read the response as text first instead of
   * directly calling res.json().
   *
   * Why?
   * Sometimes Google Apps Script / the network may return an HTML
   * error page instead of JSON. Calling res.json() directly would
   * produce:
   *
   * Unexpected token '<'
   */
  const fetchMasterData = async (attempt = 1) => {
    const MAX_ATTEMPTS = 3;

    try {
      setError(null);

      console.log(`Fetching master data... Attempt ${attempt}/${MAX_ATTEMPTS}`);

      const res = await fetch(IN_OUT_API, {
        method: "POST",
        body: JSON.stringify({
          action: "getMasterData",
        }),
      });

      /*
       * First check HTTP status.
       *
       * A 404/500/etc. should NOT be passed to JSON.parse().
       */
      if (!res.ok) {
        throw new Error(
          `Master data API returned HTTP ${res.status} ${res.statusText}`,
        );
      }

      /*
       * Read as text first.
       *
       * This protects us from HTML responses such as:
       * <!DOCTYPE html>
       */
      const responseText = await res.text();

      let result;

      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error(
          "Master data API returned non-JSON response:",
          responseText.substring(0, 500),
        );

        throw new Error(
          "Master data API returned an invalid response instead of JSON.",
        );
      }

      if (result.status !== "success") {
        throw new Error(result.message || "Failed to fetch master data.");
      }

      /*
       * Successfully received master data.
       */
      setMasterData(Array.isArray(result.data) ? result.data : []);

      console.log(
        `Master data loaded successfully: ${result.data?.length || 0} items`,
      );

      return result.data;
    } catch (err) {
      console.error(
        `Error fetching master data (attempt ${attempt}/${MAX_ATTEMPTS}):`,
        err,
      );

      /*
       * Retry temporary failures.
       *
       * We don't retry forever.
       */
      if (attempt < MAX_ATTEMPTS) {
        const delay = attempt * 1000;

        console.log(
          `Retrying master data request in ${delay / 1000} second...`,
        );

        await new Promise((resolve) => setTimeout(resolve, delay));

        return fetchMasterData(attempt + 1);
      }

      /*
       * All attempts failed.
       */
      setError(err.message || "Unable to fetch master data.");

      /*
       * Keep existing master data if we already have some.
       *
       * This is useful when refresh happens after submission.
       */
      return null;
    } finally {
      /*
       * Only the outermost call should finish loading.
       *
       * Because recursive retry calls also execute finally,
       * we don't want loading to turn false during an intermediate retry.
       */
      if (attempt === 1) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  return (
    <MasterDataContext.Provider
      value={{
        masterData,
        loading,
        error,
        fetchMasterData,
      }}
    >
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => useContext(MasterDataContext);
