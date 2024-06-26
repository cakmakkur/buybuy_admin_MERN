import { Toast, ToastPosition } from 'react-hot-toast';


type ToastConfigType = Partial<Pick<Toast, "id" | "icon" | "duration" | "ariaProps" | "className" | "style" | "position" | "iconTheme">>;


const toastConfigs: ToastConfigType = {
  duration: 4000,
  position: "top-right",
};

export default toastConfigs