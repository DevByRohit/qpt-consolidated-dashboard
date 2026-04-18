import MaterialRow from "./MaterialRow";

const MaterialTable = ({
  fields,
  control,
  register,
  remove,
  masterData,
  skuOptions,
  nameOptions,
  setValue,
  handleAddRow,
  trigger,
  errors,
  setAlertConfig,
  watch,
}) => {
  return (
    <div className="flex-1 border rounded overflow-hidden min-h-0">
      <div className="h-full overflow-y-auto space-y-3 p-2">
        {fields.map((field, index) => (
          <MaterialRow
            key={field.id}
            field={field}
            index={index}
            control={control}
            register={register}
            remove={remove}
            masterData={masterData}
            skuOptions={skuOptions}
            nameOptions={nameOptions}
            setValue={setValue}
            fieldsLength={fields.length}
            handleAddRow={handleAddRow}
            trigger={trigger}
            errors={errors}
            setAlertConfig={setAlertConfig}
            watch={watch}
          />
        ))}
      </div>
    </div>
  );
};

export default MaterialTable;
