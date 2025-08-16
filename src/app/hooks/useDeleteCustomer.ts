
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const deleteCustomer = async (id: number) => {
  const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
    withCredentials: true,
  });
  return data;
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
