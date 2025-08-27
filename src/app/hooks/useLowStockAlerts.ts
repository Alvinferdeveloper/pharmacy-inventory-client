
import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { Product } from './useProducts';

const getLowStockAlerts = async (): Promise<Product[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alerts/low-stock`, {
    withCredentials: true
  });
  return data;
};

export const useLowStockAlerts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['lowStockAlerts'],
    queryFn: getLowStockAlerts,
  });
};
