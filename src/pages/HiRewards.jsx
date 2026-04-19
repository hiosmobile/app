import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import RippleButton from "../../components/RippleButton";
import RewardsCodeWidget from "../../components/RewardsCodeWidget";
import frameImg from "../assets/media/frame.png";
import { useAuth } from "../AuthContext";

export default function Rewards() {
  const [activeOffers, setActiveOffers] = useState([]);
  const [expiredOffers, setExpiredOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  const { currentUser } = useAuth();

  const BLOG_ID = "8654667946288784337";
  const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY || "";

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setIsLoading(true);
    setError(null);

    if (!API_KEY) {
      setError("Please configure your Blogger API Key in your .env file.");
      setIsLoading(false);
      return;
    }

    try {
      const [activeData, expiredData] = await Promise.all([
        fetchOffersByLabel("active-offer"),
        fetchOffersByLabel("expired-offer"),
      ]);

      setActiveOffers(sortOffersByDate(activeData));
      setExpiredOffers(sortOffersByDate(expiredData));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOffersByLabel = async (label) => {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?fetchBodies=true&labels=${label}&key=${API_KEY}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      const posts = data.items || [];
      return posts.map(parseBloggerPost);
    } else {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || response.statusText;
      throw new Error(`Google API Error: ${errorMsg}`);
    }
  };

  const parseBloggerPost = (post) => {
    let rawContent = post.content || "";

    let textWithNewlines = rawContent
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n");

    const doc = new DOMParser().parseFromString(textWithNewlines, "text/html");
    const cleanText = doc.body.textContent || "";

    const parts = cleanText.split("===DETAILS===");
    const description = parts[0].trim();
    const detailsSection = parts.length > 1 ? parts[1].trim() : "";

    let expiryInfo = "No expiry information.";
    let points = null;
    let postedDate = post.published ? new Date(post.published) : null;

    if (detailsSection) {
      const lines = detailsSection.split("\n");
      lines.forEach((line) => {
        const cleanLine = line.trim();
        const lowerLine = cleanLine.toLowerCase();

        if (lowerLine.startsWith("points:")) {
          const val = parseInt(cleanLine.substring(7).trim(), 10);
          if (!isNaN(val)) points = val;
        } else if (lowerLine.startsWith("expires:")) {
          expiryInfo = cleanLine.substring(8).trim();
        } else if (lowerLine.startsWith("posted:")) {
          const dateStr = cleanLine.substring(7).trim();
          const spaceSplit = dateStr.split(" ");

          if (spaceSplit.length > 0) {
            const dateParts = spaceSplit[0].split("/");
            if (dateParts.length === 3) {
              const day = parseInt(dateParts[0], 10);
              const month = parseInt(dateParts[1], 10) - 1;
              const year = parseInt(dateParts[2], 10);

              let hours = 0;
              let minutes = 0;
              if (spaceSplit.length > 1) {
                const timeParts = spaceSplit[1].split(":");
                if (timeParts.length >= 2) {
                  hours = parseInt(timeParts[0], 10);
                  minutes = parseInt(timeParts[1], 10);
                }
              }
              postedDate = new Date(year, month, day, hours, minutes);
            }
          }
        }
      });
    }

    return {
      id: post.id,
      title: post.title || "No Title",
      description,
      expiryInfo,
      points,
      postedDate,
    };
  };

  const sortOffersByDate = (offers) => {
    return [...offers].sort((a, b) => {
      const timeA = a.postedDate ? a.postedDate.getTime() : 0;
      const timeB = b.postedDate ? b.postedDate.getTime() : 0;
      return timeB - timeA;
    });
  };

  const handleRedeem = (offer) => {
    alert(
      `To redeem "${offer.title}", please scan your membership barcode at the till.`,
    );
  };

  const renderOfferCard = (offer, isExpired, isLast) => {
    const showRedeemButton = offer.points !== null && !isExpired;
    const formattedDate = offer.postedDate
      ? offer.postedDate.toLocaleDateString("en-GB")
      : "";
    const cardClass = `mt-2 ${isLast ? "joinBottom" : ""}`;

    return (
      <Card key={offer.id} className={cardClass} bodyClass="p-3 text-start">
        <div className="d-flex justify-content-between align-items-start">
          <h2 className="card-title m-0" style={{ fontSize: "1.25rem" }}>
            {offer.title}
          </h2>
          {formattedDate && <small>{formattedDate}</small>}
        </div>

        <p className="card-text mt-2" style={{ whiteSpace: "pre-line" }}>
          {offer.description}
        </p>

        <div
          className="d-flex align-items-center mb-3"
          style={{ fontSize: "0.85rem" }}
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "16px", marginRight: "4px" }}
          >
            schedule
          </span>
          {offer.expiryInfo}
        </div>

        {showRedeemButton && (
          <div className="d-flex justify-content-between align-items-center pt-3 border-top">
            <div className="text-start">
              <small
                className="d-block fw-bold"
                style={{
                  fontSize: "10px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Cost
              </small>
              <strong className="text-primary">{offer.points} Points</strong>
            </div>
            <RippleButton
              className="form-button m-0 px-4 py-2"
              onClick={() => handleRedeem(offer)}
            >
              Redeem
            </RippleButton>
          </div>
        )}
      </Card>
    );
  };

  return (
    <main className="container mt-4 mb-5">
      <Card className="full" bodyClass="text-start">
        <div className="top-container">
          <h1 className="blue-h2">
            <span className="titleIcon material-symbols-rounded">loyalty</span>
            HiRewards
          </h1>
          <p className="subtitle mb-0">
            View your active offers and scan your membership at checkout.
          </p>
        </div>
      </Card>

      <Card className="mt-2 joinTop" bodyClass="p-2">
        <div className="sub-nav-pills-header">
          <button
            className={`sub-header-tab ripple-button ${
              activeTab === "active" ? "active" : ""
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active Offers
          </button>
          <button
            className={`sub-header-tab ripple-button ${
              activeTab === "expired" ? "active" : ""
            }`}
            onClick={() => setActiveTab("expired")}
          >
            Expired Offers
          </button>
        </div>
      </Card>

      <div className="tab-content mt-2">
        {isLoading ? (
          <Card className="joinBottom text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </Card>
        ) : error ? (
          <Card className="joinBottom text-center py-5">
            <span
              className="material-symbols-rounded"
              style={{ fontSize: "48px" }}
            >
              cloud_off
            </span>
            <h2 className="card-title mt-3">Connection Error</h2>
            <p className="card-text mx-4">{error}</p>
            <RippleButton
              className="form-button mx-auto mt-3"
              onClick={fetchOffers}
            >
              <span className="form-button-icon material-symbols-rounded">
                refresh
              </span>
              Retry
            </RippleButton>
          </Card>
        ) : (
          <>
            {activeTab === "active" && (
              <div className="fade show active">
                {/* Replaced static icon card with RewardsCodeWidget */}
                <RewardsCodeWidget
                  code="490020-384380-3842992-9"
                  imageSrc={frameImg}
                />

                {activeOffers.length === 0 ? (
                  <Card className="mt-2 joinBottom text-center py-5">
                    <span
                      className="material-symbols-rounded"
                      style={{ fontSize: "48px" }}
                    >
                      local_offer
                    </span>
                    <h2 className="card-title mt-3">No active offers</h2>
                    <p className="card-text">
                      Check back later for new rewards!
                    </p>
                  </Card>
                ) : (
                  activeOffers.map((offer, index) =>
                    renderOfferCard(
                      offer,
                      false,
                      index === activeOffers.length - 1,
                    ),
                  )
                )}
              </div>
            )}

            {activeTab === "expired" && (
              <div className="fade show active">
                {expiredOffers.length === 0 ? (
                  <Card className="joinBottom text-center py-5">
                    <span
                      className="material-symbols-rounded"
                      style={{ fontSize: "48px" }}
                    >
                      local_offer
                    </span>
                    <h2 className="card-title mt-3">No expired offers</h2>
                    <p className="card-text">
                      You have no expired offers to display.
                    </p>
                  </Card>
                ) : (
                  expiredOffers.map((offer, index) =>
                    renderOfferCard(
                      offer,
                      true,
                      index === expiredOffers.length - 1,
                    ),
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
