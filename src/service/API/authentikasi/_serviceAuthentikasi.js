import { AxiosConfig } from "../../AxiosConfig";

export const handleLogin = async (data) => {
  try {
    const response = await AxiosConfig.post("/login", data);
    return response.data.data.user;
  } catch (error) {
    throw error;
  }
};

export const CheckLogin = async (token) => {
    try {
      const response = await AxiosConfig.post("/user", {
        token,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const Logout = async (token) => {
    try {
      const response = await AxiosConfig.post("/logout", {
        token,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };