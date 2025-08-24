
import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { Product } from './useProducts';
import { Customer } from '../clientes/types/customer.dto';
import { User } from './useUsers';

export interface InvoiceDetail {
    idDetail: number;
    quantity: number;
    unitPrice: string;
    subtotal: string;
    product: Product;
}

export interface Invoice {
    idInvoice: number;
    date: string;
    total: string;
    tax: string;
    discount: string;
    customer: Customer;
    user: User;
    invoiceDetails: InvoiceDetail[];
}

const getInvoices = async (date?: string): Promise<Invoice[]> => {
  const params = date ? { date } : {};
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoice`, {
    params,
    withCredentials: true
  });
  return data;
};

export const useInvoices = (date?: string) => {
  return useQuery<Invoice[], Error>({
    queryKey: ['invoices', date],
    queryFn: () => getInvoices(date),
  });
};
