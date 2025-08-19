
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from "sonner"

const deleteSupplier = async (id: number) => {
  const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${id}`, {
    withCredentials: true
  });
  return data;
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success("Proveedor eliminado exitosamente")
    },
    onError: (error: any) => {
      toast.error("Ocurrio un error al eliminar el proveedor");
    }
  });

  return mutation;
};
