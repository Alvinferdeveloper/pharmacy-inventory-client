import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Customer } from '../clientes/types/customer.dto';

const getClients = async (): Promise<Customer[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
    withCredentials: true
  });
  return data;
};

export const useClients = () => {
  return useQuery<Customer[], Error>({
    queryKey: ['clients'],
    queryFn: getClients,
  });
};
