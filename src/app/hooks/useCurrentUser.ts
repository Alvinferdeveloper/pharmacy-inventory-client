import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { usePathname } from 'next/navigation';

interface User {
  idUser: number;
  identification: string;
  phone: string;
  email: string;
  roles: string[];
  mustChangePassword: boolean;
}

interface User {
  idUser: number;
  identification: string;
  phone: string;
  name: string;
  email: string;
  roles: string[];
  mustChangePassword: boolean;
}

const getProfile = async (): Promise<User> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
    withCredentials: true,
  });
  return data;
};

export const useCurrentUser = () => {
  return useQuery<User, Error>({
    queryKey: ['currentUser'],
    queryFn: getProfile,
    retry: false,
  });
};
