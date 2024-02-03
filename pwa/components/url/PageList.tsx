import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Url } from "../../types/Url";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getUrlsPath = (page?: string | string[] | undefined) =>
  `/urls${typeof page === "string" ? `?page=${page}` : ""}`;
export const getUrls = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Url>>(getUrlsPath(page));
const getPagePath = (path: string) => `/urls/page/${parsePage("urls", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: urls, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Url>> | undefined
  >(getUrlsPath(page), getUrls(page));
  const collection = useMercure(urls, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Url List</title>
        </Head>
      </div>
      <List urls={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
