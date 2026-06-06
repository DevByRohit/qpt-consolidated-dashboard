import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Loader from "../../alert-modal/Loader";
import PlanningForm from "./components/PlanningForm";
import { getProducts, generateKitting } from "./services/productionApi";
import SummaryCards from "./components/SummaryCards";
import ConsolidatedMaterialsTable from "./components/ConsolidatedMaterialsTable";
import FinishedGoodsBreakdown from "./components/FinishedGoodsBreakdown";
import { useProductionPlanning } from "./components/ProductionPlanningContext";
import PrintConsolidatedReport from "./print/PrintConsolidatedReport";
import PrintFGAnalysisReport from "./print/PrintFGAnalysisReport";

const ProductionPlanning = () => {
  const [loading, setLoading] = useState(false);
  const { products, setProducts } = useProductionPlanning();
  const [planningResult, setPlanningResult] = useState(null);

  // this state for print functionality
  const [lastPlanningPayload, setLastPlanningPayload] = useState(null);
  const consolidatedPrintRef = useRef(null);
  const fgAnalysisPrintRef = useRef(null);

  // Print Handler for consolidated report
  const handlePrintConsolidated = useReactToPrint({
    contentRef: consolidatedPrintRef,
    documentTitle: "Consolidated-Kitting-Report",
  });

  // Print Handler for FGAnalysis report
  const handlePrintFGAnalysis = useReactToPrint({
    contentRef: fgAnalysisPrintRef,
    documentTitle: "FG-Analysis-Report",
  });

  useEffect(() => {
    if (products.length > 0) {
      return;
    }

    fetchProducts();
  }, []);

  // Fetch FG master data
  const fetchProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Generate Full Kitting
  const handleGenerate = async (payload) => {
    try {
      setLoading(true);

      const result = await generateKitting(payload);

      setPlanningResult(result);

      // set the user payload
      setLastPlanningPayload(payload);
    } catch (error) {
      console.error("Error generating kitting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      {/* Loader */}
      {loading && (
        <Loader
          message="Generating Full Kitting Report"
          subMessage="Please wait while production planning is being calculated..."
        />
      )}

      {/* Planning Form */}
      <PlanningForm
        products={products}
        onGenerate={handleGenerate}
        handlePrintConsolidated={handlePrintConsolidated}
        handlePrintFGAnalysis={handlePrintFGAnalysis}
      />

      {/* Temporary JSON Response Viewer */}
      {planningResult && (
        <>
          <SummaryCards summary={planningResult.summary} />

          <ConsolidatedMaterialsTable materials={planningResult.materials} />

          <FinishedGoodsBreakdown fgBreakdown={planningResult.fg_breakdown} />

          <div className="hidden">
            <div ref={consolidatedPrintRef}>
              <PrintConsolidatedReport
                planningResult={planningResult}
                payload={lastPlanningPayload}
                products={products}
              />
            </div>
          </div>

          <div className="hidden">
            <div ref={fgAnalysisPrintRef}>
              <PrintFGAnalysisReport
                planningResult={planningResult}
                payload={lastPlanningPayload}
                products={products}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductionPlanning;
