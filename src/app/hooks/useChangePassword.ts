import { useMutation } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { toast } from "sonner"

interface ChangePasswordPayload {
  id: number;
  payload: {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };
}

const changePassword = async ({ id, payload }: ChangePasswordPayload) => {
  const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/change-password`, payload);
  return data;
};

export const useChangePassword = () => {
  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Contraseña cambiada exitosamente");
    },
    onError: (error: any) => {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrió un error inesperado al cambiar la contraseña");
    }
  });

  return mutation;
};