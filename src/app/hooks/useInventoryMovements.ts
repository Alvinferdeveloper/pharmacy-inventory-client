
import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { Product } from './useProducts';

export interface InventoryMovement {
    idMovement: number;
    movementType: 'in' | 'out';
    quantity: number;
    date: string;
    reason: string;
    product: Product;
}

const getInventoryMovements = async (productId?: number, startDate?: string, endDate?: string): Promise<InventoryMovement[]> => {
  const params = new URLSearchParams();
  if (productId) params.append('productId', String(productId));
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventory-movements`, {
    params,
    withCredentials: true
  });
  return data;
};

export const useInventoryMovements = (productId?: number, startDate?: string, endDate?: string) => {
  return useQuery<InventoryMovement[], Error>({
    queryKey: ['inventoryMovements', productId, startDate, endDate],
    queryFn: () => getInventoryMovements(productId, startDate, endDate),
    enabled: !!productId || (!!startDate && !!endDate),
  });
};
