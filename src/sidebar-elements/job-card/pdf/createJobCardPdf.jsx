import { pdf } from "@react-pdf/renderer";
import JobCardPDF from "./JobCardPDF";

export const createJobCardPdf = async (jobCard) => {
  const blob = await pdf(<JobCardPDF jobCard={jobCard} />).toBlob();

  return blob;
};
