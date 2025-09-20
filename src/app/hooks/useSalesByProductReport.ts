import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';

interface SalesByProductReportParams {
  productCode: string;
}

interface InvoiceDetail {
  productId: number;
  quantity: number;
  unitPrice: number;
  code: string;
  subtotal: number;
  invoice: { idInvoice: number; date: string; customer: { customerName: string } };
  product: { productName: string };
}

const fetchSalesByProductReport = async (params: SalesByProductReportParams): Promise<InvoiceDetail[]> => {
  const { productCode } = params;
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports/sales-by-product?productCode=${productCode}`, {
    withCredentials: true
  });
  return data;
};

export const useSalesByProductReport = (params: SalesByProductReportParams, enabled: boolean) => {
  return useQuery<InvoiceDetail[], Error>({
    queryKey: ['salesByProductReport', params],
    queryFn: () => fetchSalesByProductReport(params),
    enabled: enabled && !!params.productCode,
  });
};
