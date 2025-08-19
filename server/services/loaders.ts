import { type LoaderFunctionArgs } from "react-router";
import queryString from "query-string";
import hashIds from "server/services/hashId";
import { getPageCriteria } from "server/services/utilities";
import { PAGE_MODE } from "~/constants";

export const searchParamsLoader = async <T, Q = any>(
  req: LoaderFunctionArgs,
  findAndCountFunc: (query: Q, pagiOptions: { take, skip }) => Promise<any>,
  options: {
    autoSearch,
  } = { autoSearch: false },
) : Promise<{
  data: any[];
  rows: T[];
  pagination: { page: number, perPage: number, total: number };
  query: Q;
}>=> {
  const { query } = queryString.parseUrl(req.request.url) as Record<any, any>;
  const { page = options.autoSearch ? 1 : undefined, perPage = 50 } = query;
  if (page) {
    const pureQuery = { ...query };
    delete pureQuery.page;
    delete pureQuery.perPage;
    const [rows, count] = await findAndCountFunc(pureQuery, getPageCriteria(query));
    const data = rows.map((item) => item.toJSON());
    const pagination = { page: parseInt(page), perPage, total: count };
    return { data, rows, pagination, query };
  }
  return { data: [], rows: [], pagination: { page: 1, perPage: 1, total: 0 }, query }
};

export const detailPageLoader = ({ params }: LoaderFunctionArgs, hashIdKey = 'hashId') => {
  const hashId = params[hashIdKey];
  const isCreate = hashId === 'create';
  return {
    id: isCreate ? undefined : hashIds.decode(hashId),
    mode: isCreate ? PAGE_MODE.MODE_CREATE : PAGE_MODE.MODE_EDIT, 
  }
}