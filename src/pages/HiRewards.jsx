import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  RippleButton,
  PageHeader,
  Row,
  Col,
} from "../../components/HiMaterial";

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
  const navigate = useNavigate();

  const firstName = currentUser?.displayName?.split(" ")[0] || "Member";
  const membershipCode = currentUser?.uid
    ? currentUser.uid.slice(0, 10).toUpperCase()
    : "490020-384380-3842992-9";

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
        const cleanLine = line.trim().toLowerCase();
        if (cleanLine.startsWith("points:")) {
          const val = parseInt(line.substring(7).trim(), 10);
          if (!isNaN(val)) points = val;
        } else if (cleanLine.startsWith("expires:")) {
          expiryInfo = line.substring(8).trim();
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
    alert(`To redeem "${offer.title}", please scan your QR code at the till.`);
  };

  const renderOfferCard = (offer, isExpired, isLast) => {
    const showRedeemButton = offer.points !== null && !isExpired;
    const formattedDate = offer.postedDate
      ? offer.postedDate.toLocaleDateString("en-GB")
      : "";

    // Join Middle for everything except the last item, which caps the list
    const cardClass = isLast ? "joinBottom" : "joinMiddle";

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
                style={{ fontSize: "10px", textTransform: "uppercase" }}
              >
                Cost
              </small>
              <strong className="text-primary">{offer.points} Points</strong>
            </div>
            <RippleButton
              className="form-button m-0 px-4 py-2"
              onClick={() => handleRedeem(offer)}
            >
              Redem
            </RippleButton>
          </div>
        )}
      </Card>
    );
  };

  return (
    <main className="container mt-4 mb-5">
      <Row className="mb-2">
        <Col size={12}>
          <PageHeader
            icon="award_star"
            title="HiRewards"
            subtitle={`The more money you spend at our brands, the more money we make,
          and eventually the more money you save. Time to dig deep in that
          wallet of yours, ${firstName}.`}
          />
        </Col>
      </Row>

      <Row className="mb-2">
        <Col size={12}>
          <RewardsCodeWidget code={membershipCode} imageSrc={frameImg} />
        </Col>
      </Row>

      <Row className="g-2">
        <Col size={12}>
          {/* Header is now joinTop */}
          <Card className="mt-2 joinTop" bodyClass="p-2">
            <div className="sub-nav-pills-header">
              <button
                className={`sub-header-tab ripple-button ${activeTab === "active" ? "active" : ""}`}
                onClick={() => setActiveTab("active")}
              >
                Active Offers
              </button>
              <button
                className={`sub-header-tab ripple-button ${activeTab === "expired" ? "active" : ""}`}
                onClick={() => setActiveTab("expired")}
              >
                Expired Offers
              </button>
            </div>
          </Card>

          {/* Offers List */}
          <div className="tab-content">
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
                  Retry
                </RippleButton>
              </Card>
            ) : (
              <>
                {activeTab === "active" && (
                  <div className="fade show active">
                    {activeOffers.length === 0 ? (
                      <Card className="joinBottom text-center py-5">
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
        </Col>
      </Row>
    </main>
  );
}
