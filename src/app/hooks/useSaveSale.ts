import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';

interface SaleProduct {
  productId: number;
  quantity: number;
}

interface SalePayload {
  customerId: number;
  products: SaleProduct[];
}

const saveSale = async (saleData: SalePayload) => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/invoice/purchase`, saleData, {
    withCredentials: true
  });
  return data;
};

export const useSaveSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSale,
    onSuccess: () => {
      // Invalidate and refetch products query to update stock
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
