import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';

export interface Role {
  idRole: number;
  roleName: string;
  description: string;
}

export interface User {
  idUser: number;
  name: string;
  identification: string;
  phone: string;
  email?: string;
  role: Role;
  isActive: boolean;
  deletedAt?: string;
}

const getUsers = async (): Promise<User[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    withCredentials: true
  });
  return data;
};

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};
