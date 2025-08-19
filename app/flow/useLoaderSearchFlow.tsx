import { useLoaderData, useNavigate } from "react-router";
import classNames from "classnames";
import queryString from "query-string";
import { type HTMLAttributes, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button, Pagination, type ButtonProps } from '@heroui/react';

type DefaultQuery<T> = Partial<T>;

function useLoaderSearchFlow<T = any, Q = DefaultQuery<T>>({
  onSearch = () => { },
}: {
  onSearch?: () => Promise<Q> | Q | void
} = {}) {
  const {
    data, pagination, query,
  } = useLoaderData<{ data: T[], pagination: { page, perPage, total }, query: any }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = useCallback(async (page = 1) => {
    const newQuery = await onSearch();
    navigate({ search: `?${queryString.stringify({ ...newQuery, page })}` });
  }, [navigate, onSearch]);

  const cRef = useRef({ search, t, navigate });
  cRef.current.search = search;
  cRef.current.t = t;
  cRef.current.navigate = navigate;

  const SearchPageNav = useCallback(() => <Pagination total={Math.ceil(pagination.total / pagination.perPage)} page={pagination.page} onChange={(page) => cRef.current.search(page)} />, [pagination]);
  const SearchButton = useCallback(({ className, ...props } = {} as ButtonProps) =>
    <Button {...props} variant="bordered" className={classNames('SearchButton', className)} onClick={() => cRef.current.search()}>{props?.children || cRef.current.t('Search')}</Button>, []);
  const CreateButton = useCallback(({ className, ...props } = {} as ButtonProps) =>
    <Button {...props} variant="flat" className={classNames('CreateButton', className)} onClick={() => cRef.current.navigate('./create')}>{props?.children || cRef.current.t('Create')}</Button>, []);
  const SearchQueryBlock = useCallback(({ className, ...props } = {} as HTMLAttributes<HTMLDivElement>) =>
    <div {...props} className={classNames('SearchQueryBlock', className)} />, []);
  const SearchResultBlock = useCallback(({ className, ...props } = {} as HTMLAttributes<HTMLDivElement>) =>
    <div {...props} className={classNames('SearchResultBlock', className)} />, []);

  return ({
    data,
    query: query as Q,
    pagination,
    SearchPageNav,
    SearchButton,
    CreateButton,
    SearchQueryBlock,
    SearchResultBlock,
  })
}

export default useLoaderSearchFlow;
