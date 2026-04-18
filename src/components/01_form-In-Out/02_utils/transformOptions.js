export const getSkuOptions = (data) => {
  return data.map((item) => ({
    value: item.sku,
    label: item.sku,
  }));
};

export const getNameOptions = (data) => {
  return data.map((item) => ({
    value: item.name,
    label: item.name,
  }));
};
