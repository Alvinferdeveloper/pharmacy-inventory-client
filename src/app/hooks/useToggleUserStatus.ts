import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { toast } from "sonner"

const toggleUserStatus = async (userId: number) => {
  const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/toggle-status`);
  return data;
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, number>({
    mutationFn: toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Estado del usuario actualizado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar el estado del usuario");
    }
  });
};