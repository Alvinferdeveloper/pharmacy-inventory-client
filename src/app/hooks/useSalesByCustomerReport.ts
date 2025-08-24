import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';

interface SalesByCustomerReportParams {
  customerIdentification: string;
}

interface InvoiceDetail {
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: { productName: string };
}

interface Invoice {
  idInvoice: number;
  date: string;
  customer: { customerName: string };
  user: { name: string };
  total: number;
  invoiceDetails: InvoiceDetail[];
}

const fetchSalesByCustomerReport = async (params: SalesByCustomerReportParams): Promise<Invoice[]> => {
  const { customerIdentification } = params;
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports/sales-by-customer?=${customerIdentification}`, {
    withCredentials: true
  });
  return data;
};

export const useSalesByCustomerReport = (params: SalesByCustomerReportParams, enabled: boolean) => {
  return useQuery<Invoice[], Error>({
    queryKey: ['salesByCustomerReport', params],
    queryFn: () => fetchSalesByCustomerReport(params),
    enabled: enabled && !!params.customerIdentification,
  });
};
