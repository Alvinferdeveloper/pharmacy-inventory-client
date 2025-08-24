import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { AxiosError } from 'axios';
import { toast } from "sonner"
import { CategorySchema } from '../categorias/components/category-dialog';

const addCategory = async (category: CategorySchema) => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories`, category, {
    withCredentials: true,
  });
  return data;
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, CategorySchema>({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Categoría agregada exitosamente");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        error.message = 'Una categoría con el mismo nombre ya existe';
        return;
      }
      error.message = 'Ocurrio un error al agregar la categoría';
    },
  });
};
