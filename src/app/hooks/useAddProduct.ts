import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export interface AddProductPayload {
  productName: string;
  code: string;
  description: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  expirationDate: string;
  idCategory: number;
  idSupplier: number;
}

const addProduct = async (product: AddProductPayload) => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, product, {
    withCredentials: true
  });
  return data;
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: AxiosError) => {
      if (error.status == 409) {
        error.message = 'Un producto con el mismo código ya existe';
        return;
      }
      error.message = 'Ocurrio un error al agregar el producto';
    }
  });

  return mutation;
};