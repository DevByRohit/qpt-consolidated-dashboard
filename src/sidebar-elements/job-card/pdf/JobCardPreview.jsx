import { PDFViewer } from "@react-pdf/renderer";
import JobCardPDF from "./JobCardPDF";

const JobCardPreview = ({ jobCard }) => {
  if (!jobCard) return null;

  return (
    <div className="w-full h-screen border rounded-lg overflow-hidden">
      <PDFViewer width="100%" height="100%" showToolbar={true}>
        <JobCardPDF jobCard={jobCard} />
      </PDFViewer>
    </div>
  );
};

export default JobCardPreview;
