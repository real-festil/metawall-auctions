/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { useRouter } from 'next/router';
import Link from 'next/link'
import moment from 'moment';
import Countdown from 'react-countdown';
import Head from 'next/head';
import YouTube from 'react-youtube';

const Icon = () => (
  <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M6.66659 20.5708L13.3333 18.1963V-5H6.66659V20.5708ZM20.0001 15.8219L26.6666 13.4475V35H33.3333V11.0731L26.6667 13.4475V-5H20V15.8219L13.3334 18.1963V35H20.0001V15.8219ZM40.0001 8.69863L33.3334 11.0731V-5H40.0001V8.69863ZM0 35H6.66667V20.5708L0 22.8539V35Z" fill="white"/>
  </svg>
);

const Burger = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 16H28" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M4 6.66666H28" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M4 25.3333H28" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

const Info = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18L12 10" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 7H12.01" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const Article = () => {
  const [data, setData] = useState(null as any);
  const [pref, setPref] = useState(null as any);
  const [isShowMore, setShowMore] = useState(false);

  const router = useRouter()
  const db = getDatabase();

  useEffect(() => {
    const auctionsRef = ref(db, 'Auctions/');
    onValue(auctionsRef, (snapshot) => {
      const data = snapshot.val();
      setData(data);
    });
    const prefRef = ref(db, 'Preferences/');
    onValue(prefRef, (snapshot) => {
      const pref = snapshot.val();
      setPref(pref);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let pageData;

  if(data) {
    pageData = data.find((d:any) => d.ID == router.query.id)
  }

  return (
    <>
      <Head>
        <title>Metawall</title>
      </Head>
      <header className="header">
        <Link href="https://metawall.io/">
          <a>
            <Icon />
          </a>
        </Link>
        <Burger />
      </header>
      {pageData && pref && (
        <section className="article">
          <div className="articleImage">
            {pageData.StreamStatus === "Active" ? (
              <YouTube videoId={pageData.StreamURL.split("v=")[1]} containerClassName={"youtubeContainer"} />
            ) : (
              <>
                <img src={pageData.ArtworkPreviewImg} alt="Preview" />
                {pageData.StreamStatus === "Active" && (
                  <div className="articleImageStatus">
                    LIVE
                  </div>
                )}
              </>
              )}
          </div>
          <div className="articleInfo">
            <div style={{overflowY: "auto"}}>
              <h3 className="articleInfoTitle">{pageData.ArtworkTitle}</h3>
              {!isShowMore ? (
                <p className="articleInfoDesc">{pageData.ArtworkDescription.slice(0, 200)} ... <span onClick={() => setShowMore(true)}>Read More</span></p>
                ) : (
                <p className="articleInfoDesc">{pageData.ArtworkDescription} <span onClick={() => setShowMore(false)}>Read Less</span></p>
              )}
              <div className="articleInfoAuthor">
                <div className="articleInfoAuthorInfo">
                  <img src={pageData.ArtistImg} alt="author" />
                  <div className="articleInfoAuthorInfoText">
                    <p>Author</p>
                    <p>{pageData.ArtistName}</p>
                  </div>
                </div>
                <Link href={pageData.ArtistURL}>
                  <a target="_blank">
                    <Info />
                  </a>
                </Link>
              </div>
              <h4 className="articleInfoSubtitle">Activity</h4>
              <div className="articleInfoBids">
                  {pageData.Bids.filter((bid: any) => bid.ApprovedByAdmin).map((bid: any, i: number) => (
                    <div key={i} className="articleInfoBidsBid">
                      <p><span className="articleInfoBidsSum">{bid.BidAmountETH} ETH</span> by <span className="articleInfoBidsNum">{bid.BidderWallet.slice(0, 11)}...{bid.BidderWallet.slice(40, 42)}</span></p>
                      <p>{moment(bid.Date).format("YY.MM.DD HH:SS")}</p>
                    </div>
                  ))}
              </div>
            </div>
            <div className="articleInfoAction">
              <div className="articleInfoActionInfo">
                <div className="articleInfoActionInfoBlock">
                  <p>Current Bid</p>
                  <p>{pageData.CurrentBidAmountETH} ETH <span>${(pageData.CurrentBidAmountETH * pref.ETHUSD).toFixed(0)}</span></p>
                </div>
                <div className="articleInfoActionInfoBlock">
                  <p>Auction ending in</p>
                  {console.log(moment(new Date(pageData.DateEnd)).toISOString())}
                  <Countdown daysInHours date={moment(pageData.DateEnd).toISOString()} />
                </div>
              </div>
              <Link href={pageData.BidFormURL}>
                  <a className="articleInfoActionButton" target="_blank">
                    Place Bid
                  </a>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Article
