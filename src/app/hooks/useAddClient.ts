import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { ClientSchema } from '../clientes/types/cliente.schema';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const addClient = async (client: ClientSchema) => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/customers`, client, {
    withCredentials: true,
  });
  return data;
};

export const useAddClient = () => {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, ClientSchema>({
    mutationFn: addClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success("Cliente agregado exitosamente");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        error.message = 'La identificación ya existe';
        return;
      }
      error.message = 'Error al crear el cliente';
    },
  });
};
