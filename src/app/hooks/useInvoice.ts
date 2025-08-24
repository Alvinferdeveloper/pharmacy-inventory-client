
import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { Invoice } from './useInvoices';

const getInvoice = async (id: number): Promise<Invoice> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoice/${id}`, {
    withCredentials: true
  });
  return data;
};

export const useInvoice = (id: number) => {
  return useQuery<Invoice, Error>({
    queryKey: ['invoice', id],
    queryFn: () => getInvoice(id),
    enabled: !!id,
  });
};
