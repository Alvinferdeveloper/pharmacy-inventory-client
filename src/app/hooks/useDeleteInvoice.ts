
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { toast } from "sonner"

const deleteInvoice = async (id: number) => {
  const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/invoice/${id}`, {
    withCredentials: true
  });
  return data;
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['myInvoices'] });
      toast.success("Factura eliminada exitosamente")
    },
    onError: (error: any) => {
      toast.error("Ocurrió un error al eliminar la factura");
    }
  });

  return mutation;
};
