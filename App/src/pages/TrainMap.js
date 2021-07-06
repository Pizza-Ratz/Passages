import React, { Component } from 'react';
import mapUrl, { ReactComponent as Map } from '../images/map-detail-transparent.svg';
import Layout from '../components/layout'

export default class TrainMap extends Component {


  render(){

   
    return (
      <Layout>
      <div className="train-container">
      <Map />
      </div>
      </Layout>

    )
  }
}