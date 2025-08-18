import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from "sonner"

export interface UpdateProductPayload {
  productName?: string;
  code?: string;
  description?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  stock?: number;
  expirationDate?: string;
  idCategory?: number;
  idSupplier?: number;
}

const updateProduct = async ({ id, payload }: { id: number; payload: UpdateProductPayload }) => {
  const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, payload, {
    withCredentials: true
  });
  return data;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Producto actualizado exitosamente")
    },
    onError: (error: AxiosError) => {
      if (error.status == 409) {
        error.message = 'Un producto con el mismo código ya existe';
        return;
      }
      error.message = 'Ocurrio un error al actualizar el producto';
    }
  });

  return mutation;
};