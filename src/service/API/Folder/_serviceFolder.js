import handleError from "../../../utils/HandleError";
import { AxiosConfig } from "./../../AxiosConfig";

export const createFolder = async (data) => {
  try {
    const response = await AxiosConfig.post("/create/folder", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const handleGetFolder = async () => {
  try {
    const response = await AxiosConfig.get("/folder");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSingleFolder = async (id) => {
  try {
    const response = await AxiosConfig.get(`/folder/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (id, files) => {
  try {
    const data = { urls: files }; // Format data yang dikirim
    const response = await AxiosConfig.post(`/upload/file/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeNameFodler = async (id, name) => {
  try {
    const response = await AxiosConfig.put(`/rename/folder/${id}`, { name });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteFolder = async (id) => {
  try {
    const response = await AxiosConfig.delete(`/folder/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
