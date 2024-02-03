import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getUrls,
  getUrlsPath,
} from "../../../components/url/PageList";
import { PagedCollection } from "../../../types/collection";
import { Url } from "../../../types/Url";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getUrlsPath(page), getUrls(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Url>>("/urls");
  const paths = await getCollectionPaths(response, "urls", "/urls/page/[page]");

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
