// src/components/ToastNotification.tsx

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastNotification = () => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    toastStyle={{
      borderRadius: '8px',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    }}
  />
);