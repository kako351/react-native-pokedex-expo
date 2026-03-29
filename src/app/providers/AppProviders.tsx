import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { createAppQueryClient } from '@/src/app/providers/queryClient';

export function AppProviders({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const [queryClient] = useState(() => createAppQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
