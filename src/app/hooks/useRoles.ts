
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Role {
    idRole: number;
    roleName: string;
    description: string;
}

const getRoles = async (): Promise<Role[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/roles`, {
    withCredentials: true
  });
  return data;
};

export const useRoles = () => {
  return useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: getRoles,
  });
};
