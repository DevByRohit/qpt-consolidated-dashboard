import FormCard from "./FormCard";
import { formsList } from "../data/formsList";

const FormsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {formsList.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </div>
  );
};

export default FormsGrid;
