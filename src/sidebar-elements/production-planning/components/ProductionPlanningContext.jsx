import { createContext, useContext, useState } from "react";

const ProductionPlanningContext = createContext();

export const ProductionPlanningProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  return (
    <ProductionPlanningContext.Provider
      value={{
        products,
        setProducts,
      }}
    >
      {children}
    </ProductionPlanningContext.Provider>
  );
};

export const useProductionPlanning = () => {
  return useContext(ProductionPlanningContext);
};
