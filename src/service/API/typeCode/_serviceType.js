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

export const updatedCode = async (id, data) => {
  try {
    const response = await AxiosConfig.put(`/type/code/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNewCode = async (data) => {
  try {
    const response = await AxiosConfig.post("/create/code", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCode = async (id) => {
  try {
    const response = await AxiosConfig.delete(`/type/code/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteType = async (id) => {
  try {
    const response = await AxiosConfig.delete(`/type/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}