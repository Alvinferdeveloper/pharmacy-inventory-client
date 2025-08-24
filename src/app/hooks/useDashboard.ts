import { useQuery } from '@tanstack/react-query';
import axios from '@/app/lib/axios';

interface DashboardStats {
  totalSalesToday: number;
  totalSalesThisMonth: number;
  lowStockProducts: any[];
  recentInvoices: any[];
}

const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/dashboard-stats`, {
    withCredentials: true,
  });
  return data;
};

export const useDashboardStats = () => {
  return useQuery<DashboardStats, Error>({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });
};

interface SalesOverTime {
  date: string;
  total: number;
}

const getSalesOverTime = async (period: string): Promise<SalesOverTime[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/sales-over-time?period=${period}`, {
    withCredentials: true,
  });
  return data;
};

export const useSalesOverTime = (period: string) => {
  return useQuery<SalesOverTime[], Error>({
    queryKey: ['sales-over-time', period],
    queryFn: () => getSalesOverTime(period),
  });
};

interface BestSellingProduct {
  idProduct: number;
  productName: string;
  totalQuantity: string;
}

const getBestSellingProducts = async (): Promise<BestSellingProduct[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/best-selling-products`, {
    withCredentials: true,
  });
  return data;
};

export const useBestSellingProducts = () => {
  return useQuery<BestSellingProduct[], Error>({
    queryKey: ['best-selling-products'],
    queryFn: getBestSellingProducts,
  });
};
