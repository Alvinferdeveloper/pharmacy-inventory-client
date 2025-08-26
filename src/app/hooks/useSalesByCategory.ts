
import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';

interface SalesByCategory {
  categoryName: string;
  total: number;
}

const getSalesByCategory = async (): Promise<SalesByCategory[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/sales-by-category`, {
    withCredentials: true
  });
  return data;
};

export const useSalesByCategory = () => {
  return useQuery<SalesByCategory[], Error>({
    queryKey: ['salesByCategory'],
    queryFn: getSalesByCategory,
  });
};
