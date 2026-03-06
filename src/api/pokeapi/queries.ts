import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query';
import {
  fetchEvolutionChain,
  fetchPokemonDetail,
  fetchPokemonList,
  fetchPokemonSpecies,
} from './client';

const PER_PARGE: number = 30;
const INITIAL_PAGE: number = 0;

export const pokemonKeys = {
  all: ['pokemon'] as const,

  /**
   * ポケモン一覧取得用のクエリキーを生成します。
   *
   * @param params 一覧取得条件
   * @returns React Query 用のクエリキー
   */
  list: (params: { limit: number }) =>
    [...pokemonKeys.all, 'list', params] as const,

  /**
   * ポケモン詳細取得用のクエリキーを生成します。
   *
   * @param name ポケモン名
   * @returns React Query 用のクエリキー
   */
  detail: (name: string) => [...pokemonKeys.all, 'detail', name] as const,

  /**
   * ポケモン種族情報取得用のクエリキーを生成します。
   *
   * @param name ポケモン名
   * @returns React Query 用のクエリキー
   */
  species: (name: string) => [...pokemonKeys.all, 'species', name] as const,

  /**
   * 進化チェーン取得用のクエリキーを生成します。
   *
   * @param url 進化チェーンAPIのURL
   * @returns React Query 用のクエリキー
   */
  evolutionChain: (url: string) =>
    [...pokemonKeys.all, 'evolution-chain', url] as const,
};

/**
 * ポケモン一覧をページングしながら取得する無限クエリフックです。
 *
 * @param limit 1ページあたりの取得件数
 * @returns 無限スクロール用のクエリ結果
 */
export function usePokemonListInfinite(limit = PER_PARGE) {
  return useInfiniteQuery({
    queryKey: pokemonKeys.list({ limit }),
    queryFn: ({ pageParam }) =>
      fetchPokemonList({ limit, offset: pageParam as number }),
    initialPageParam: INITIAL_PAGE,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length * limit;
    },
  });
}

/**
 * 指定したポケモン名の詳細情報を取得するクエリフックです。
 *
 * @param name ポケモン名
 * @returns ポケモン詳細のクエリ結果
 */
export function usePokemonDetail(name: string) {
  return useQuery({
    queryKey: pokemonKeys.detail(name),
    queryFn: () => fetchPokemonDetail(name),
    enabled: !!name,
  });
}

/**
 * 指定したポケモン名の種族情報を取得するクエリフックです。
 *
 * @param name ポケモン名
 * @returns ポケモン種族情報のクエリ結果
 */
export function usePokemonSpecies(name: string) {
  return useQuery({
    queryKey: pokemonKeys.species(name),
    queryFn: () => fetchPokemonSpecies(name),
    enabled: !!name,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useSpeciesQueries(names: Array<string>) {
  return useQueries({
    queries: names.map((name) => ({
      queryKey: ['pokemon', 'species', name] as const,
      queryFn: () => fetchPokemonSpecies(name),
      staleTime: 24 * 60 * 60 * 1000,
    })),
  })
}
 
/**
 * 指定した進化チェーンURLから進化情報を取得するクエリフックです。
 *
 * @param url 進化チェーンAPIのURL
 * @returns 進化チェーン情報のクエリ結果
 */
export function useEvolutionChain(url?: string) {
  return useQuery({
    queryKey: url ? pokemonKeys.evolutionChain(url) : pokemonKeys.all,
    queryFn: () => fetchEvolutionChain(url!),
    enabled: !!url,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
