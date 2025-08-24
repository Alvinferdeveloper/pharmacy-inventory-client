import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';

export interface Category {
  idCategory: number;
  categoryName: string;
  description: string;
  deletedAt?: any;
}

export interface Supplier {
  idSupplier: number;
  supplierName: string;
  address: string;
  phone: string;
  email: string;
  deletedAt?: any;
}

export interface Product {
  idProduct: number;
  code: string;
  productName: string;
  description: string;
  purchasePrice: string;
  sellingPrice: string;
  stock: number;
  expirationDate: string;
  imageUrl?: any;
  category: Category;
  supplier: Supplier;
  deletedAt?: any;
}


const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    withCredentials: true
  });
  return data;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};
