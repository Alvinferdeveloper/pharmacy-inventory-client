import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { AxiosError } from 'axios';
import { toast } from "sonner"
import { CategorySchema } from '../categorias/components/category-dialog';

const updateCategory = async ({ id, payload }: { id: number; payload: CategorySchema }) => {
  const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, payload, {
    withCredentials: true,
  });
  return data;
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, { id: number; payload: CategorySchema }>({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Categoría actualizada exitosamente");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        error.message = 'Una categoría con el mismo nombre ya existe';
        return;
      }
      error.message = 'Ocurrio un error al actualizar la categoría';
    },
  });
};
