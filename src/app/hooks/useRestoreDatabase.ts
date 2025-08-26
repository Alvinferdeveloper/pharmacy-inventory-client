import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { toast } from "sonner"
import { AxiosError } from 'axios'
import { useEffect } from 'react'

const restoreDatabase = async (fileName: string) => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/database/restore`, { fileName });
  return data;
};

export const useRestoreDatabase = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, AxiosError, string>({
    mutationFn: restoreDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries(); // Invalidate all queries to refetch data
      toast.success("Base de datos restaurada exitosamente");
    },
    onError: (error: AxiosError) => {
      console.log(error)
      error.message = "Ocurrió un error inesperado al restaurar la base de datos"
    }
  });

  useEffect(() => {
    if (mutation.error) {
      const timer = setTimeout(() => {
        mutation.reset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mutation.error, mutation.reset]);

  return mutation;
};
