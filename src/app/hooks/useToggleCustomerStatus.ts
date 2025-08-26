
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { toast } from "sonner"

const toggleCustomerStatus = async (id: number) => {
  const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}/toggle-status`);
  return data;
};

export const useToggleCustomerStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: toggleCustomerStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success("Estado de cliente actualizado exitosamente")
    },
    onError: (error: any) => {
      toast.error("Ocurrió un error al actualizar el estado del cliente");
    }
  });

  return mutation;
};
