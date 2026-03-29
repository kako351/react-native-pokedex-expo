import { pickJapaneseName } from '@/src/api/pokeapi/pokemonSpeciesMapper';
import {
  fetchAbility,
  fetchMove,
  fetchPokemonSpecies,
} from '@/src/api/pokeapi/client';
import {
  useEvolutionChain,
  usePokemonDetail,
  usePokemonSpecies,
} from '@/src/api/pokeapi/queries';
import {
  buildPokemonDetailScreenModel,
  flattenEvolutionChainNames,
  pickJaLocalizedName,
} from '@/src/features/pokedex/mappers/pokemonDetailScreenMapper';
import type { PokemonDetailScreenData } from '@/src/features/pokedex/model/pokemonDetailScreenData';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

export function usePokemonDetailScreen(name: string, moveLimit = 4) {
  const safeName = name?.trim() ?? '';

  const detailQ = usePokemonDetail(safeName);
  const speciesQ = usePokemonSpecies(safeName);
  const evolutionUrl = speciesQ.data?.evolution_chain?.url;
  const evoQ = useEvolutionChain(evolutionUrl);

  const evolutionRawNames = useMemo(
    () => (evoQ.data ? flattenEvolutionChainNames(evoQ.data) : []),
    [evoQ.data],
  );

  const evolutionSpeciesQueries = useQueries({
    queries: evolutionRawNames.map((evoName) => ({
      queryKey: ['pokemon', 'species', evoName] as const,
      queryFn: () => fetchPokemonSpecies(evoName),
      staleTime: 24 * 60 * 60 * 1000,
    })),
  });

  const abilityResources = useMemo(
    () =>
      detailQ.data?.abilities
        .slice()
        .sort((a, b) => a.slot - b.slot)
        .map((ability) => ability.ability) ?? [],
    [detailQ.data],
  );

  const abilityQueries = useQueries({
    queries: abilityResources.map((ability) => ({
      queryKey: ['pokemon', 'ability', ability.url] as const,
      queryFn: () => fetchAbility(ability.url),
      staleTime: 24 * 60 * 60 * 1000,
    })),
  });

  const moveResources = useMemo(
    () =>
      detailQ.data?.moves.slice(0, moveLimit).map((move) => move.move) ?? [],
    [detailQ.data, moveLimit],
  );

  const moveQueries = useQueries({
    queries: moveResources.map((move) => ({
      queryKey: ['pokemon', 'move', move.url] as const,
      queryFn: () => fetchMove(move.url),
      staleTime: 24 * 60 * 60 * 1000,
    })),
  });

  const isEvolutionSpeciesLoading = evolutionSpeciesQueries.some(
    (q) => q.isLoading,
  );
  const evolutionSpeciesError =
    evolutionSpeciesQueries.find((q) => q.isError)?.error ?? null;
  const isAbilityLoading = abilityQueries.some((q) => q.isLoading);
  const abilityError = abilityQueries.find((q) => q.isError)?.error ?? null;
  const isMoveLoading = moveQueries.some((q) => q.isLoading);
  const moveError = moveQueries.find((q) => q.isError)?.error ?? null;

  const isLoading =
    detailQ.isLoading ||
    speciesQ.isLoading ||
    evoQ.isLoading ||
    isEvolutionSpeciesLoading ||
    isAbilityLoading ||
    isMoveLoading;

  const isError =
    detailQ.isError ||
    speciesQ.isError ||
    evoQ.isError ||
    !!evolutionSpeciesError ||
    !!abilityError ||
    !!moveError;

  const error = (detailQ.error ??
    speciesQ.error ??
    evoQ.error ??
    evolutionSpeciesError ??
    abilityError ??
    moveError) as Error | null;

  const data: PokemonDetailScreenData | null = useMemo(() => {
    if (!detailQ.data || !speciesQ.data) {
      return null;
    }

    const evolutionNames = evolutionRawNames.map((evoName, idx) => {
      const species = evolutionSpeciesQueries[idx]?.data;
      return species ? pickJapaneseName(species) : evoName;
    });

    const abilityNames = abilityResources.map((ability, idx) => {
      const abilityData = abilityQueries[idx]?.data;
      return abilityData
        ? pickJaLocalizedName(abilityData.names, ability.name)
        : ability.name;
    });

    const moveList = moveResources.map((move, idx) => {
      const moveData = moveQueries[idx]?.data;
      return moveData
        ? pickJaLocalizedName(moveData.names, move.name)
        : move.name;
    });

    return buildPokemonDetailScreenModel({
      detail: detailQ.data,
      species: speciesQ.data,
      evolutionNames,
      abilityNames,
      moveList,
    });
  }, [
    detailQ.data,
    speciesQ.data,
    evolutionRawNames,
    evolutionSpeciesQueries,
    abilityResources,
    abilityQueries,
    moveResources,
    moveQueries,
  ]);

  return { isLoading, isError, error, data };
}
