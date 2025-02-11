import React, { useEffect, useState } from "react";
import whiteCard1 from "../../../src/assets/images/whiteCard1.png";
import BlueCard from "../../../src/assets/images/blueCard.png";
import limeCard from "../../../src/assets/images/limeCard.png";
import orangeCard from "../../../src/assets/images/orangeCard.png";
import Config from "../../../Config/Config";
import { Helmet } from "react-helmet-async";
function Offers() {
  const images = [whiteCard1, BlueCard, limeCard, orangeCard];
  const [offers, setOffers] = useState([]);

  const getOffers = () => {
    Config.getOffers()
      .then((res) => {
        if (res.status === 200) {
          setOffers(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getOffers();
  }, []);

  return (
    <>
      <Helmet>
        <title>Exclusive Offers - Global Tuition</title>
        <meta
          name="description"
          content="Check out the latest offers on online tuition services, available now at Global Tuition. Grab your discount code and start learning today!"
        />
      </Helmet>
      {offers.map((offer, index) => (
        <div key={index} className="w-full flex justify-center">
          <div className="w-full py-8 px-4   max-w-[1200px]">
            <div
              className={`w-full h-full flex flex-col md:flex-row ${
                offer.theme === "Orange"
                  ? "redCard"
                  : offer.theme === "Lime"
                  ? "limeCard"
                  : offer.theme === "Blue"
                  ? "blueCard"
                  : offer.theme === "White"
                  ? "whiteCard"
                  : ""
              }`}
            >
              <div className="w-full md:w-1/2">
                <img
                  src={
                    offer.theme === "White"
                      ? images[0]
                      : offer.theme === "Orange"
                      ? images[3]
                      : offer.theme === "Blue"
                      ? images[1]
                      : offer.theme === "Lime"
                      ? images[2]
                      : ""
                  }
                  alt=""
                  className="h-full w-full"
                />
              </div>

              <div className="flex flex-col justify-center items-start w-full md:w-1/2 gap-y-4">
                <p
                  className={`${
                    offer.theme === "Blue"
                      ? "blueCardText"
                      : "text-7xl text-black max-w-full break-words"
                  }`}
                  dangerouslySetInnerHTML={{ __html: offer.title }}
                ></p>
                <p
                  className="text-xl font-semibold text-black/70 tracking-wider leading-tight"
                  dangerouslySetInnerHTML={{ __html: offer.description }}
                ></p>
                <p className="text-2xl text-black italic">
                  <strong className="text-base tracking-wider">Code:</strong>{" "}
                  {`GT-${offer.code}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Offers;
