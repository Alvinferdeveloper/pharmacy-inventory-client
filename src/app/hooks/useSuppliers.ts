
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Supplier } from './useProducts';

const getSuppliers = async (): Promise<Supplier[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/supplier`, {
    withCredentials: true
  });
  return data;
};

export const useSuppliers = () => {
  return useQuery<Supplier[], Error>({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
  });
};
