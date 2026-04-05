import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersService } from '@/lib/api/customers';

const CUSTOMERS_KEY = ['customers'];

export function useCustomers() {
  return useQuery({
    queryKey: CUSTOMERS_KEY,
    queryFn: customersService.list,
  });
}

export function useImportCustomers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => customersService.import(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });
}
