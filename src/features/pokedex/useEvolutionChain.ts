import { fetchEvolutionChain } from '@/src/api/pokeapi/client';
import { pokemonKeys } from '@/src/api/pokeapi/queries';
import { useQuery } from '@tanstack/react-query';

export function useEvolutionChain(url?: string) {
  const q = useQuery({
    queryKey: url ? pokemonKeys.evolutionChain(url) : pokemonKeys.all,
    queryFn: () => fetchEvolutionChain(url!),
    enabled: !!url,
    staleTime: 24 * 60 * 60 * 1000,
  });
  return q.data;
}
