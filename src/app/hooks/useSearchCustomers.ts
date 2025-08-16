import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Customer } from '../clientes/types/customer.dto';

const searchCustomers = async (term: string): Promise<Customer[]> => {
  if (!term) {
    return [];
  }
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers/search?term=${term}`, {
    withCredentials: true,
  });
  return data;
};

export const useSearchCustomers = (term: string) => {
  return useQuery<Customer[], Error>({
    queryKey: ['customers', term],
    queryFn: () => searchCustomers(term),
    enabled: term.length > 2,
  });
};
