import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { Invoice } from './useInvoices'; // Re-use the same type

const fetchMyInvoices = async (): Promise<Invoice[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoice/my-invoices`);
  return data;
};

export const useMyInvoices = (enabled: boolean = true) => {
  return useQuery<Invoice[], Error>({
    queryKey: ['myInvoices'],
    queryFn: fetchMyInvoices,
    enabled: enabled, // Control query execution
  });
};
