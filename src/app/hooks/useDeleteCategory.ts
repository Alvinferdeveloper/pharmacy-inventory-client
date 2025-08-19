
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

const deleteCategory = async (id: number) => {
  const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
    withCredentials: true,
  });
  return data;
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, number>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Categoría eliminada exitosamente");
    },
    onError: (error: AxiosError) => {
      error.message = 'Ocurrio un error al eliminar la categoría';
    },
  });
};
