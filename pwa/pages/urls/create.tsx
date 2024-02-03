import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/url/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Url</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
