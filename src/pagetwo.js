import React, { useEffect } from "react";
import "./App.css";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import uniswapLogo from "./uniswap-logo.png";
import bdplogo from "./bdptoken.png";
import { Link } from "react-router-dom";

const BDP_QUERY = gql`
  {
    token(id: "0xf3dcbc6d72a4e1892f7917b7c43b74131df8480e") {
      name
      symbol
      decimals
      derivedETH
      tradeVolumeUSD
      totalLiquidity
    }
  }
`;

const BDP_ETH_PAIR = gql`
  {
    pair(id: "0x80a0102a1e601c55fd3f136128bb2d222a879ff3") {
      token0 {
        id
        symbol
        name
        derivedETH
      }
      token1 {
        id
        symbol
        name
        derivedETH
      }
      reserve0
      reserve1
      reserveUSD
      trackedReserveETH
      token0Price
      token1Price
      volumeUSD
      txCount
    }
  }
`;

const ETH_PRICE_QUERY = gql`
  query bundles {
    bundles(where: { id: "1" }) {
      ethPrice
    }
  }
`;

function BDP() {
  const { loading: ethLoading, data: ethPriceData } = useQuery(ETH_PRICE_QUERY);

  const { loading: bdploading, error: bdperror, data: bdpdata } = useQuery(
    BDP_QUERY
  );
  const { loading: pairloading, error: pairerror, data: pairdata } = useQuery(
    BDP_ETH_PAIR
  );
  if (bdploading) return "Loading...";
  if (bdperror) return `Error! ${bdperror.message}`;
  if (pairloading) return "Loading...";
  if (pairerror) return `Error! ${pairerror.message}`;
  // console.log("object keys " + Object.keys(bdpdata))
  const {
    name,
    symbol,
    decimals,
    derivedETH,
    tradeVolumeUSD,
    totalLiquidity,
  } = bdpdata.token;
  const {
    reserve0,
    reserve1,
    reserveUSD,
    token1Price,
    trackedReserveETH,
    volumeUSD,
    txCount,
  } = pairdata.pair;

  const ethPriceInUSD = ethPriceData && ethPriceData.bundles[0].ethPrice;

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <img
          src={uniswapLogo}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt=""
        />
        &nbsp; Uniswap Explorer
      </nav>
      <div id={"linktopagetwo"}>
        <Link className='link' to="pagetwo">DAO Voting</Link>
      </div>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <img
                src={bdplogo}
                width="150"
                height="150"
                className="mb-4"
                alt=""
                id={'bdplogo'}
              />
              <h2>Name:{name}</h2>
              <div id={"mygrid"}>
                <div className={"tokendata"}>Symbol:</div>
                <div>{symbol}</div>
                <div className={"tokendata"}>decimals:</div>
                <div> {decimals}</div>
                <div className={"tokendata"}>derivedETH:</div>
                <div> {derivedETH}</div>
                <div className={"tokendata"}>tradeVolumeUSD:</div>
                <div>{tradeVolumeUSD}</div>
                <div className={"tokendata"}>totalLiquidity:</div>
                <div> {totalLiquidity}</div>
                <div className={"pairinfo"}>Reserve0:</div>
                <div> {reserve0}</div>
                <div className={"pairinfo"}>Reserve1:</div>
                <div> {reserve1}</div>
                <div className={"pairinfo"}>ReserveUSD:</div>
                <div> {reserveUSD}</div>
                <div className={"pairinfo"}>BDP in ETH:</div>
                <div> {token1Price}</div>
                <div className={"pairinfo"}>Reserved ETH:</div>
                <div> {trackedReserveETH}</div>
                <div className={"pairinfo"}>Trade Volume USD:</div>
                <div> {tradeVolumeUSD}</div>
                <div className={"pairinfo"}>Transaction Count:</div>
                <div> {txCount}</div>
                <div>ETH price: </div>
                <div>
                  {ethLoading
                    ? "Loading token data..."
                    : "$" +
                      // parse responses as floats and fix to 2 decimals
                      parseFloat(ethPriceInUSD).toFixed(2)}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default BDP;
