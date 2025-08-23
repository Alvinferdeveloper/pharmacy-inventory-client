
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from "sonner"

export interface AddUserPayload {
  name: string;
  identification: string;
  phone: string;
  email?: string;
  
  roleId: number;
}

const addUser = async (user: AddUserPayload) => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, user, {
    withCredentials: true
  });
  return data;
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Usuario agregado exitosamente")
    },
    onError: (error: AxiosError) => {
      if (error.response && error.response.data && (error.response.data as any).message) {
        throw new Error((error.response.data as any).message);
      }
      throw new Error("Ocurrió un error inesperado al agregar el usuario");
    }
  });

  return mutation;
};
