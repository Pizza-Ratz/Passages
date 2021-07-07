import * as React from "react";
import Layout from "../components/layout";
import TrainMap from "./TrainMap";

// markup
const IndexPage = () => {
  return (
    <>
      <Layout>
        <TrainMap />
        <div className='stars'></div>
        <div className='twinkling'></div>
        <div className='clouds'></div>
      </Layout>
    </>
  );
};

export default IndexPage;
