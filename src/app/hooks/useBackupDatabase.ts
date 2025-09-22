import { useMutation } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { AxiosError } from 'axios';

const backupDatabase = async ({ description }: { description?: string }) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/database/backup`, { description }, {
    responseType: 'blob',
  });
  return response;
};

export const useBackupDatabase = () => {
  return useMutation<any, AxiosError, { description?: string }>({ // Update the type here
    mutationFn: backupDatabase,
  });
};
