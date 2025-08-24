import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';

interface SalesReportByDateRangeParams {
  startDate: string;
  endDate: string;
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

const fetchSalesReportByDateRange = async (params: SalesReportByDateRangeParams): Promise<Invoice[]> => {
  const { startDate, endDate } = params;
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports/sales-by-date?startDate=${startDate}&endDate=${endDate}`, {
    withCredentials: true
  });
  return data;
};

export const useSalesReportByDateRange = (params: SalesReportByDateRangeParams, enabled: boolean) => {
  return useQuery<Invoice[], Error>({
    queryKey: ['salesReportByDateRange', params],
    queryFn: () => fetchSalesReportByDateRange(params),
    enabled: enabled && !!params.startDate && !!params.endDate,
  });
};
