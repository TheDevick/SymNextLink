import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/url/Show";
import { PagedCollection } from "../../../types/collection";
import { Url } from "../../../types/Url";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getUrl = async (id: string | string[] | undefined) =>
  id ? await fetch<Url>(`/urls/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: url, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Url> | undefined>(["url", id], () => getUrl(id));
  const urlData = useMercure(url, hubURL);

  if (!urlData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Url ${urlData["@id"]}`}</title>
        </Head>
      </div>
      <Show url={urlData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["url", id], () => getUrl(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Url>>("/urls");
  const paths = await getItemPaths(response, "urls", "/urls/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
