import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  RippleButton,
  PageHeader,
  Row,
  Col,
  InfoBubble,
  Modal,
  MenuActionBtn, // <-- Imported the new Modal component
} from "../../components/HiMaterial";

import { RewardsCodeWidget } from "../../components/Widgets";
import frameImg from "../assets/media/frame.png";
import { useAuth } from "../AuthContext";

export default function Rewards() {
  const [activeOffers, setActiveOffers] = useState([]);
  const [expiredOffers, setExpiredOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  const [redeemOffer, setRedeemOffer] = useState(null);

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
    setRedeemOffer(offer);
  };

  const closeRedeemModal = () => {
    setRedeemOffer(null);
  };

  const renderOfferCard = (offer, isExpired, isLast, index) => {
    const showRedeemButton = offer.points !== null && !isExpired;
    const formattedDate = offer.postedDate
      ? offer.postedDate.toLocaleDateString("en-GB")
      : "";

    const joinClass = isLast ? "joinBottom" : "joinMiddle";
    const delayNum = index + 4;
    const cardClass = `${joinClass} metro-anim-list-item delay-${delayNum}`;

    return (
      <Card key={offer.id} className={cardClass} bodyClass="p-3 text-start">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h2 className="blue-h3 m-0" style={{ fontSize: "1.5rem" }}>
            {offer.title}
          </h2>
        </div>

        <p
          className="card-text mb-4 mt-2"
          style={{ whiteSpace: "pre-line", fontSize: "1rem" }}
        >
          {offer.description}
        </p>

        {/* Dynamic Action / Metadata Block */}
        <div className="mt-2">
          {isExpired ? (
            /* --- EXPIRED LAYOUT (Split Columns) --- */
            <Row className="g-1">
              <Col size={6}>
                <InfoBubble
                  icon="calendar_today"
                  title="Posted"
                  className="joinLeft h-100 m-0"
                >
                  {formattedDate || "Unknown"}
                </InfoBubble>
              </Col>
              <Col size={6}>
                <InfoBubble
                  icon="history"
                  title="Expired"
                  className="joinRight h-100 m-0"
                >
                  {offer.expiryInfo}
                </InfoBubble>
              </Col>
            </Row>
          ) : (
            /* --- ACTIVE LAYOUT (Stacked) --- */
            <>
              <InfoBubble
                icon="schedule"
                title="Expiry Details"
                className={showRedeemButton ? "joinTop m-0" : "full m-0"}
              >
                {offer.expiryInfo}
              </InfoBubble>

              {showRedeemButton && (
                <RippleButton
                  className="button joinBottom"
                  onClick={() => handleRedeem(offer)}
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--onPrimary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "none",
                    padding: "0 20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      className="material-symbols-rounded"
                      style={{
                        marginRight: "10px",
                        fontSize: "24px",
                        lineHeight: "60px",
                      }}
                    >
                      local_activity
                    </span>
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        lineHeight: "60px",
                      }}
                    >
                      Redeem
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      backgroundColor: "rgba(0,0,0,0.15)",
                      padding: "6px 12px",
                      borderRadius: "16px",
                      lineHeight: "normal",
                    }}
                  >
                    {offer.points} pts
                  </span>
                </RippleButton>
              )}
            </>
          )}
        </div>
      </Card>
    );
  };

  return (
    <>
      <main className="container mt-4 mb-5">
        <Row>
          <Col size={12}>
            <PageHeader
              title="Rewards"
              subtitle={`Get rewarded for visiting and spending money at our awesome brands!`}
              className="pb-3 joinTop metro-anim-list-item delay-1"
            />
          </Col>
        </Row>

        <Row>
          <Col size={12}>
            <RewardsCodeWidget
              code={membershipCode}
              imageSrc={frameImg}
              className="joinBottom metro-anim-list-item delay-2"
            />
          </Col>
        </Row>

        <Row className="g-2">
          <Col size={12}>
            <Card
              className="mt-1 joinTop metro-anim-list-item delay-3"
              bodyClass="p-2"
            >
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

            <div className="tab-content">
              {isLoading ? (
                <Card className="joinBottom text-center py-5 metro-anim-list-item delay-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </Card>
              ) : error ? (
                <Card className="joinBottom text-center py-5 metro-anim-list-item delay-4">
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
                    <div>
                      {activeOffers.length === 0 ? (
                        <Card className="joinBottom text-center py-5 metro-anim-list-item delay-4">
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
                            index,
                          ),
                        )
                      )}
                    </div>
                  )}

                  {activeTab === "expired" && (
                    <div>
                      {expiredOffers.length === 0 ? (
                        <Card className="joinBottom text-center py-5 metro-anim-list-item delay-4">
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
                            index,
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

      {/* Reusable Modal Component */}
      <Modal isOpen={!!redeemOffer} title="Redeem Offer" appName="rewards">
        <p className="text-start mb-4" style={{ fontSize: "1.1rem" }}>
          To redeem <strong>"{redeemOffer?.title}"</strong>, please scan your QR
          code at the till.
        </p>

        <div className="d-flex gap-2 mt-4">
          <MenuActionBtn
            icon="check"
            onClick={closeRedeemModal}
            text="Got it"
            />
        </div>
      </Modal>
    </>
  );
}
