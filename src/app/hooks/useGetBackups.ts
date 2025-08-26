
import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';

const getBackups = async (): Promise<string[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/database/backups`, {
    withCredentials: true
  });
  return data;
};

export const useGetBackups = () => {
  return useQuery<string[], Error>({
    queryKey: ['backups'],
    queryFn: getBackups,
  });
};
