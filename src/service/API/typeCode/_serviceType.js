import { AxiosConfig } from "../../AxiosConfig";

export const handlePostType = async (data) => {
  try {
    const response = await AxiosConfig.post("/type", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const handleGetType = async () => {
  try {
    const response = await AxiosConfig.get("/type");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const handleRenameTypp = async (data) => {
  try {
    const response = await AxiosConfig.put("/rename/type", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
