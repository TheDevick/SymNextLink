import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import { PageList, getUrls, getUrlsPath } from "../../components/url/PageList";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getUrlsPath(), getUrls());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default PageList;
