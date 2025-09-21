import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';

interface ProductsBySupplierReportParams {
  supplierName: string;
}

interface Product {
  idProduct: number;
  code: string;
  productName: string;
  description: string;
  purchasePrice: string;
  sellingPrice: string;
  stock: number;
  expirationDate: string;
  imageUrl?: any;
  category: { categoryName: string };
  supplier: { supplierName: string };
}

const fetchProductsBySupplierReport = async (params: ProductsBySupplierReportParams): Promise<Product[]> => {
  const { supplierName } = params;
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports/products-by-supplier?supplierName=${supplierName}`, {
    withCredentials: true
  });
  return data;
};

export const useProductsBySupplierReport = (params: ProductsBySupplierReportParams, enabled: boolean) => {
  return useQuery<Product[], Error>({
    queryKey: ['productsBySupplierReport', params],
    queryFn: () => fetchProductsBySupplierReport(params),
    enabled: enabled && !!params.supplierName,
  });
};
