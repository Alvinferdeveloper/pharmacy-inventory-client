import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface UpdateCustomerPayload {
  customerName: string;
  identification: string;
  phone: string;
  address: string;
}

const updateCustomer = async ({ id, payload }: { id: number; payload: UpdateCustomerPayload }) => {
  const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, payload, {
    withCredentials: true,
  });
  return data;
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
