import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { toast } from "sonner"

export interface AddSupplierPayload {
  supplierName: string;
  address: string;
  phone: string;
  email: string;
}

const addSupplier = async (supplier: AddSupplierPayload) => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/supplier`, supplier, {
    withCredentials: true
  });
  return data;
};

export const useAddSupplier = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success("Proveedor agregado exitosamente")
    },
    onError: (error: any) => {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      }
      toast.error("Ocurrio un error al agregar el proveedor");
    }
  });

  return mutation;
};
