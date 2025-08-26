
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { toast } from "sonner"

const backupDatabase = async () => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/database/backup`);
  return data;
};

export const useBackupDatabase = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: backupDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] });
      toast.success("Respaldo creado exitosamente");
    },
    onError: (error: any) => {
      toast.error("Ocurrió un error al crear el respaldo");
    }
  });

  return mutation;
};
