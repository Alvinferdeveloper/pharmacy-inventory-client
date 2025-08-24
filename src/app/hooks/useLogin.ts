import { useMutation } from '@tanstack/react-query';
import axios from '@/app/lib/axios';
import { AxiosError } from 'axios';
import { LoginDto } from '../types/login.dto';
import { useRouter } from 'next/navigation';

const login = async (credentials: LoginDto) => {
  try{
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      credentials,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    const err = error as AxiosError
    if(err.response?.status === 401){
      throw new Error("Credenciales inválidas");
    }
    throw new Error("Error al iniciar sesión");
  }
};

export const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log('Login successful:', data);
      router.push('/');
    },
    onError: (error) => {
      console.log(error)
    },
  });
};
