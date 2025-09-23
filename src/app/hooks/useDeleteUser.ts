import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { toast } from "sonner"

const deleteUser = async (userId: number) => {
  const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`);
  return data;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, number>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Usuario eliminado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar el usuario");
    }
  });
};