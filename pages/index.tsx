import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
const ChartView = dynamic(import("components/ChartView"), { ssr: false });

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>ℝ³</title>
      </Head>
      <ChartView />
    </>
  );
};

export default IndexPage;
