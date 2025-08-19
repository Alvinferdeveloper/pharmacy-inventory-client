
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from "sonner"

export interface UpdateSupplierPayload {
  supplierName?: string;
  address?: string;
  phone?: string;
  email?: string;
}

const updateSupplier = async ({ id, payload }: { id: number; payload: UpdateSupplierPayload }) => {
  const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${id}`, payload, {
    withCredentials: true
  });
  return data;
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success("Proveedor actualizado exitosamente")
    },
    onError: (error: any) => {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      }
      toast.error("Ocurrio un error al actualizar el proveedor");
    }
  });

  return mutation;
};
