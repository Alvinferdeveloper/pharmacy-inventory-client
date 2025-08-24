import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { AxiosError } from 'axios';
import { toast } from "sonner"

const deleteUser = async (id: number) => {
  const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    withCredentials: true
  });
  return data;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Usuario eliminado exitosamente")
    },
    onError: (error: AxiosError) => {
      if (error.response && error.response.data && (error.response.data as any).message) {
        throw new Error((error.response.data as any).message);
      }
      throw new Error("Ocurrió un error inesperado al eliminar el usuario");
    }
  });

  return mutation;
};
