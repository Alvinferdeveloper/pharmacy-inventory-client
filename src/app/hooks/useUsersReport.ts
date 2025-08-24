import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';

interface User {
  idUser: number;
  name: string;
  username: string;
  role: { roleName: string };
}

const fetchUsersReport = async (): Promise<User[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports/users`, {
    withCredentials: true
  });
  return data;
};

export const useUsersReport = (enabled: boolean) => {
  return useQuery<User[], Error>({
    queryKey: ['usersReport'],
    queryFn: fetchUsersReport,
    enabled: enabled,
  });
};
