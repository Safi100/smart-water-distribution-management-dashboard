import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Notify = (title) => {
  toast(title, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};
