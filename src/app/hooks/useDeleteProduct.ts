import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from "sonner"

const deleteProduct = async (id: number) => {
  const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    withCredentials: true
  });
  return data;
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Producto eliminado exitosamente")
    },
  });
};