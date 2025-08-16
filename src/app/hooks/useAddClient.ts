import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ClientSchema } from '../clientes/types/cliente.schema';

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
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        throw new Error('La identificación ya existe');
      }
      throw new Error('Error al crear el cliente');
    },
  });
};
