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

// Generate Job Card Preview
export const generateJobCard = async (payload) => {
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
    console.error("Error generating job card:", error);

    throw error;
  }
};

// Save job card API function
export const saveJobCard = async (payload) => {
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
    console.error("Error saving job card:", error);
    throw error;
  }
};

// Get generated job cards history
export const getJobCards = async () => {
  try {
    const response = await fetch(`${BASE_URL}?action=getJobCards`);

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching Job Cards:", error);

    throw error;
  }
};

// Update Job Card Status
export const updateJobCardStatus = async (payload) => {
  console.log("payload is", payload);

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
    console.error("Error updating Job Card Status:", error);

    throw error;
  }
};

// Delete Job Card
export const deleteJobCard = async (payload) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "deleteJobCard",
        ...payload,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    console.error("Error deleting Job Card:", error);

    throw error;
  }
};
