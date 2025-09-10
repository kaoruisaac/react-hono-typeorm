import { useLoaderData, useNavigate } from 'react-router';
import classNames from 'classnames';
import queryString from 'query-string';
import { type HTMLAttributes, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardBody, Button, Pagination, type ButtonProps } from '~/components/GridSystem/heroui';
import dayjs from 'dayjs';

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
    navigate({ search: `?${queryString.stringify({ ...newQuery, page, timeStamp: dayjs().unix() })}` });
  }, [navigate, onSearch]);

  const cRef = useRef({ search, t, navigate });
  cRef.current.search = search;
  cRef.current.navigate = navigate;

  const SearchPageNav = useCallback(() => (
    <div className="mt-4">
      <Pagination total={Math.ceil(pagination.total / pagination.perPage)} page={pagination.page} onChange={(page) => cRef.current.search(page)} />
    </div>
  ), [pagination]);
  const SearchButton = useCallback(({ className, ...props } = {} as ButtonProps) =>
    <Button {...props} variant="bordered" className={classNames('SearchButton', className)} type='submit'>{props?.children || t('search')}</Button>, [t]);
  const CreateButton = useCallback(({ className, ...props } = {} as ButtonProps) =>
    <Button {...props} variant="flat" className={classNames('CreateButton', className)} onPress={() => cRef.current.navigate('./create')}>{props?.children || t('create')}</Button>, [t]);
  const SearchQueryBlock = useCallback(({ className, children, ...props } = {} as HTMLAttributes<HTMLFormElement>) => (
    <form onSubmit={(e) => { e.preventDefault(); cRef.current.search(); }} className={classNames('SearchQueryBlock', className)} {...props}>
      <Card className="shadow-sm search-card">
        <CardHeader className="pb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('search-conditions')}
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {children}
          </div>
          <div className="flex gap-2 mt-4">
            <SearchButton />
          </div>
        </CardBody>
      </Card>
    </form>
  ), []);
  const SearchResultBlock = useCallback(({ className, children, ...props } = {} as HTMLAttributes<HTMLDivElement>) => (
    <div {...props} className={classNames('SearchResultBlock', className)}>
      <Card className="shadow-sm search-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('search-results')}
            </h2>
          </div>
        </CardHeader>
        <CardBody>
          {children}
        </CardBody>
      </Card>
    </div>
  ), []);

  return ({
    data,
    query: query as Q,
    pagination,
    SearchPageNav,
    SearchButton,
    CreateButton,
    SearchQueryBlock,
    SearchResultBlock,
  });
}

export default useLoaderSearchFlow;
