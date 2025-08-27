
import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { Product } from './useProducts';

const getExpiringProductsAlerts = async (): Promise<Product[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alerts/expiring-products`, {
    withCredentials: true
  });
  return data;
};

export const useExpiringProductsAlerts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['expiringProductsAlerts'],
    queryFn: getExpiringProductsAlerts,
  });
};
