
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from "sonner"

export interface UpdateUserPayload {
  name?: string;
  identification?: string;
  phone?: string;
  email?: string;
  
  roleId?: number;
}

const updateUser = async ({ id, payload }: { id: number; payload: UpdateUserPayload }) => {
  console.log(payload)
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
      if (error.response && error.response.data && (error.response.data as any).message) {
        throw new Error((error.response.data as any).message);
      }
      throw new Error("Ocurrió un error inesperado al actualizar el usuario");
    }
  });

  return mutation;
};
