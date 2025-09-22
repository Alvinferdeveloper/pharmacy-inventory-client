import { useMutation } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { AxiosError } from 'axios'

const restoreDatabase = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/database/restore`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const useRestoreDatabase = () => {
  return useMutation<any, AxiosError, File>({
    mutationFn: restoreDatabase,
  });
};
