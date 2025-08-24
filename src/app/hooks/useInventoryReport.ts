import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';

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

const fetchInventoryReport = async (): Promise<Product[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports/inventory`, {
    withCredentials: true
  });
  return data;
};

export const useInventoryReport = (enabled: boolean) => {
  return useQuery<Product[], Error>({
    queryKey: ['inventoryReport'],
    queryFn: fetchInventoryReport,
    enabled: enabled,
  });
};
