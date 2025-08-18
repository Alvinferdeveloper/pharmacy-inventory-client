import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ClientSchema } from '../clientes/types/cliente.schema';
import { toast } from 'sonner';

const updateClient = async ({ id, payload }: { id: number; payload: ClientSchema }) => {
  const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, payload, {
    withCredentials: true,
  });
  return data;
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success("Cliente actualizado exitosamente");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        error.message = 'La identificación ya existe';
        return;
      }
      error.message = 'Error al actualizar el cliente';
    },
  });
};
