import { useState, useEffect, useRef } from "react";
import {
  getProducts,
  generateJobCard,
  saveJobCard,
} from "../production-planning/services/productionApi";
import { createJobCardPdf } from "./pdf/createJobCardPdf";
import JobCardForm from "./components/JobCardForm";
import { useProductionPlanning } from "../production-planning/components/ProductionPlanningContext";
import Loader from "../../alert-modal/Loader";
import JobCardDocument from "./components/JobCardDocument";
import { useReactToPrint } from "react-to-print";
import JobCardPreview from "./pdf/JobCardPreview";
import AlertModal from "../../alert-modal/AlertModal";
import { useJobCardContext } from "../job-card/components/JobCardContext";

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };

    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });

const JobCardPlanning = () => {
  const [loaderConfig, setLoaderConfig] = useState({
    visible: false,
    message: "",
    subMessage: "",
  });

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const [jobCard, setJobCard] = useState(null);

  const { products, setProducts } = useProductionPlanning();

  // refresh the job card container
  const { refreshJobCards } = useJobCardContext();

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

  const handleGenerate = async (payload) => {
    try {
      setLoaderConfig({
        visible: true,
        message: "Generating Job Card Preview",
        subMessage: "Please wait while job card details are being prepared...",
      });

      const result = await generateJobCard(payload);

      setJobCard(result);

      console.log("generated job card is:", result);
    } catch (error) {
      alert(error.message);
      console.error("Error generating job card:", error.message);
    } finally {
      setLoaderConfig({
        visible: false,
        message: "",
        subMessage: "",
      });
    }
  };

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${jobCard?.product_name || "Job Card"}`,
  });

  const saveJobCardHandler = async () => {
    if (!jobCard) return;

    try {
      setLoaderConfig({
        visible: true,
        message: "Saving Job Card",
        subMessage:
          "Please wait while the PDF is being generated and uploaded to Google Drive...",
      });

      const user = JSON.parse(localStorage.getItem("user"));

      console.log("user", user);

      if (!user) {
        throw new Error("User session not found.");
      }

      // Generate PDF Blob
      const pdfBlob = await createJobCardPdf(jobCard);

      // Convert Blob → Base64
      const pdfBase64 = await blobToBase64(pdfBlob);

      // Prepare API Payload
      const payload = {
        action: "saveJobCard",
        job_card: jobCard,
        pdf_base64: pdfBase64,
        created_by: {
          name: user.name,
          email: user.email,
        },
      };

      // Save Job Card
      const result = await saveJobCard(payload);

      // Refresh Job Card Context
      await refreshJobCards();

      setAlertConfig({
        isOpen: true,
        title: "Job Card Saved",
        message: `Job Card No: ${result.job_card_no} has been successfully saved to Google Drive.`,
        type: "info",
        onConfirm: null,
      });
    } catch (error) {
      console.error("Error saving Job Card:", error);

      alert(error.message || "Failed to save Job Card.");
    } finally {
      setLoaderConfig({
        visible: false,
        message: "",
        subMessage: "",
      });
    }
  };

  const handleSave = () => {
    if (!jobCard) return;

    setAlertConfig({
      isOpen: true,
      title: "Save Job Card",
      message:
        "Are you sure you want to save this Job Card? A PDF will be generated and uploaded to Google Drive.",
      type: "confirm",

      onConfirm: async () => {
        setAlertConfig((prev) => ({
          ...prev,
          isOpen: false,
        }));

        await saveJobCardHandler();
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Loader */}
      {loaderConfig.visible && (
        <Loader
          message={loaderConfig.message}
          subMessage={loaderConfig.subMessage}
        />
      )}

      <AlertModal
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={() => {
          if (alertConfig.onConfirm) {
            alertConfig.onConfirm();
          } else {
            setAlertConfig({
              isOpen: false,
              title: "",
              message: "",
              type: "info",
              onConfirm: null,
            });
          }
        }}
        onCancel={() =>
          setAlertConfig({
            isOpen: false,
            title: "",
            message: "",
            type: "info",
            onConfirm: null,
          })
        }
      />

      <JobCardForm
        products={products}
        handlePrint={handlePrint}
        handleSave={handleSave}
        onGenerate={handleGenerate}
      />

      <div ref={printRef}>
        {jobCard && <JobCardDocument jobCard={jobCard} />}
      </div>

      {/* <>
        {jobCard && (
          <JobCardDocument
            jobCard={jobCard}
            handlePrint={handlePrint}
            handleSave={handleSave}
          />
        )}

        <div className="mt-6 h-screen">
          {jobCard && <JobCardPreview jobCard={jobCard} />}
        </div>
      </> */}
    </div>
  );
};

export default JobCardPlanning;
