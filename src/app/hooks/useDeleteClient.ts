
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const deleteClient = async (id: number) => {
  const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
    withCredentials: true,
  });
  return data;
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
