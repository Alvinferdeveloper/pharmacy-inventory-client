
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { toast } from "sonner"
import { AxiosError } from 'axios';

const toggleUserStatus = async (id: number) => {
  const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/toggle-status`);
  return data;
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Estado de usuario actualizado exitosamente")
    },
    onError: (error: AxiosError) => {
      if (error.response && error.response.data && (error.response.data as any).message) {
        throw new Error((error.response.data as any).message);
      }
      throw new Error("Ocurrió un error inesperado al actualizar el estado del usuario");
    }
  });

  return mutation;
};
