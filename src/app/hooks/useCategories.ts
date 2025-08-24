import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { Category } from './useProducts';

const getCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    withCredentials: true
  });
  return data;
};

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};
