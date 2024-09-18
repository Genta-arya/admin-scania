import { toast } from "sonner";

const handleError = (error) => {

  if (error.response) {
    const { status, data } = error.response;
    const message = data?.error || "An unexpected error occurred.";

    switch (status) {
      case 400:
        toast.info(`${message}`);

        break;
      case 401:
        toast.error(`${message}`);
        setTimeout(() => (window.location.href = "/login"), 2000);
        localStorage.clear();
        break;
      case 500:
        toast.error(`${message}`);
        setTimeout(() => (window.location.href = "/login"), 2000);
        localStorage.clear();
        break;
      default:
        toast.error(`${status}: ${message}`);
        break;
    }
  } else if (error.request) {
    toast.error("Network Error: Failed to reach the server.");
    setTimeout(() => (window.location.href = "/login"), 2000);
    localStorage.clear();
  } else if (error.code === "ERR_NETWORK") {
    toast.error("Network Error: Failed to reach the server.");
    setTimeout(() => (window.location.href = "/login"), 2000);
    localStorage.clear();
  } else {
    toast.error("An unexpected error occurred.");
  }
};

export default handleError;
