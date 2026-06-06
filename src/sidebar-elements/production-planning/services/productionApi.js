import { BASE_URL } from "../services/apiStore";

// Get all FG products
export const getProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}?action=getProducts`);

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching FG products:", error);

    throw error;
  }
};

// Generate Full Kitting
export const generateKitting = async (payload) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    console.error("Error generating kitting:", error);

    throw error;
  }
};
