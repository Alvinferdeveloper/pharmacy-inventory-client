import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { AxiosError } from 'axios';
import { toast } from "sonner"

export interface UpdateUserPayload {
  name?: string;
  identification?: string;
  phone?: string;
  email?: string;

  roleId?: number;
}

const updateUser = async ({ id, payload }: { id: number; payload: UpdateUserPayload }) => {
  const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, payload, {
    withCredentials: true
  });
  return data;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Usuario actualizado exitosamente")
    },
    onError: (error: AxiosError) => {
      if (error.status == 409) {
        error.message = "Un usuario con esta identificación ya existe"
        return;
      }
      error.message = "Ocurrió un error inesperado al actualizar el usuario"
    }
  });

  return mutation;
};
