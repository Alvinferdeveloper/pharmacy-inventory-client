import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { toast } from "sonner"
import { AxiosError } from 'axios';

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
      if (error.status == 409) {
        error.message = "Un usuario con estaS identificación ya existe"
        return;
      }
      error.message = "Ocurrió un error inesperado al agregar el usuario"
    }
  });

  return mutation;
};
