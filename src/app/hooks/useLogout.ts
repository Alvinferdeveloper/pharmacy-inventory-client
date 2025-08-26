import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { toast } from "sonner"

const logout = async () => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
  return data;
};

export const useLogout = () => {
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Sesión cerrada exitosamente")
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
    onError: (error: any) => {
      toast.error("Ocurrió un error al cerrar la sesión");
    }
  });

  return mutation;
};
