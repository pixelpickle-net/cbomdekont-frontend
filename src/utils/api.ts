import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://app/api/v1/test';

export const uploadReceipt = async (formData: FormData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Diğer API fonksiyonlarını buraya ekleyin