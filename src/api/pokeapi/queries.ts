import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query';
import {
  fetchEvolutionChain,
  fetchPokemonDetail,
  fetchPokemonList,
  fetchPokemonSpecies,
  fetchPokemonType,
} from './client';

const PER_PARGE: number = 30;
const INITIAL_PAGE: number = 0;
const STALE_TIME: number = 24 * 60 * 60 * 1000;

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

  /**
   * タイプ情報取得用のクエリキーを生成します。
   *
   * @param typeName タイプ名
   * @returns React Query 用のクエリキー
   */
  type: (typeName: string) => [...pokemonKeys.all, 'type', typeName] as const,
};

/**
 * ポケモン一覧をページングしながら取得する無限クエリフックです。
 *
 * @param limit 1ページあたりの取得件数
 * @returns 無限スクロール用のクエリ結果
 */
export function usePokemonListInfinite(limit = PER_PARGE, enabled = true) {
  return useInfiniteQuery({
    queryKey: pokemonKeys.list({ limit }),
    queryFn: ({ pageParam }) =>
      fetchPokemonList({ limit, offset: pageParam as number }),
    enabled,
    initialPageParam: INITIAL_PAGE,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length * limit;
    },
  });
}

/**
 * 指定したタイプ情報を取得するクエリフックです。
 *
 * @param typeName タイプ名
 * @returns タイプ情報のクエリ結果
 */
export function usePokemonType(typeName?: string) {
  return useQuery({
    queryKey: typeName ? pokemonKeys.type(typeName) : pokemonKeys.all,
    queryFn: () => fetchPokemonType(typeName!),
    enabled: !!typeName,
    staleTime: STALE_TIME,
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
    staleTime: STALE_TIME,
  });
}

/**
 * 複数のポケモン名に対して種族情報クエリを一括で実行するフックです。
 *
 * @param names 種族情報を取得したいポケモン名の配列
 * @returns 各ポケモン名に対応する種族情報クエリ結果の配列
 */
export function useSpeciesQueries(names: string[]) {
  return useQueries({
    queries: names.map((name) => ({
      queryKey: ['pokemon', 'species', name] as const,
      queryFn: () => fetchPokemonSpecies(name),
      staleTime: STALE_TIME,
    })),
  });
}

/**
 * 複数のポケモン名に対して詳細情報クエリを一括で実行するフックです。
 *
 * @param names 詳細情報を取得したいポケモン名の配列
 * @returns 各ポケモン名に対応する詳細情報クエリ結果の配列
 */
export function useDetailQueries(names: string[]) {
  return useQueries({
    queries: names.map((name) => ({
      queryKey: ['pokemon', 'detail', name] as const,
      queryFn: () => fetchPokemonDetail(name),
      staleTime: STALE_TIME,
    })),
  });
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
    staleTime: STALE_TIME,
  });
}
