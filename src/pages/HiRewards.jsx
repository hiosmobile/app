import React, { useState, useEffect } from "react";
import {
  Card,
  PageHeader,
  SubNavPills,
  Modal,
} from "../../components/HiMaterial";
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

  const firstName = currentUser?.displayName?.split(" ")[0] || "member";
  const membershipCode = currentUser?.uid
    ? currentUser.uid.slice(0, 10).toUpperCase()
    : "490020-384380";

  const BLOG_ID = "8654667946288784337";
  const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY || "";

  const tabs = [
    { id: "active", label: "active" },
    { id: "expired", label: "expired" },
  ];

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setIsLoading(true);
    setError(null);

    if (!API_KEY) {
      setError("please configure your blogger api key.");
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
      throw new Error(`google api error: ${errorMsg}`);
    }
  };

  // ==========================================
  // CUSTOM UK DATE PARSER FOR WP7 APP
  // ==========================================
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

    let expiryInfo = "no expiry information.";
    let points = null;

    // Default to the Blogger publish date if no custom date is found
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
        // Handles "Posted: DD/MM/YYYY HH:MM"
        else if (cleanLine.startsWith("posted:")) {
          const dateStr = line.substring(7).trim();

          // Split into date and time blocks (e.g., ["01/05/2026", "00:00"])
          const [datePart, timePart] = dateStr.split(" ");

          if (datePart && datePart.includes("/")) {
            // Chop up DD/MM/YYYY
            const [day, month, year] = datePart.split("/");

            let hours = 0,
              minutes = 0;
            if (timePart && timePart.includes(":")) {
              const [h, m] = timePart.split(":");
              hours = parseInt(h, 10) || 0;
              minutes = parseInt(m, 10) || 0;
            }

            // Note: JS Months are 0-indexed (Jan = 0, May = 4)
            const parsedDate = new Date(
              year,
              parseInt(month, 10) - 1,
              day,
              hours,
              minutes,
            );

            // Override the blogger date if our custom date is mathematically valid
            if (!isNaN(parsedDate.getTime())) {
              postedDate = parsedDate;
            }
          }
        }
      });
    }

    return {
      id: post.id,
      title: post.title || "no title",
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

  const renderOfferCard = (offer, isExpired, delayIndex) => {
    // If points are null, it's just an announcement, so we don't show the redeem button.
    const showRedeemButton = offer.points !== null && !isExpired;
    const formattedDate = offer.postedDate
      ? offer.postedDate.toLocaleDateString("en-GB")
      : "unknown";

    return (
      <div
        key={offer.id}
        className={`metro-anim-list-item delay-${delayIndex}`}
        style={{ marginBottom: "15px" }}
      >
        <Card title={offer.title.toLowerCase()}>
          <p
            style={{
              whiteSpace: "pre-line",
              fontSize: "1.1rem",
              marginBottom: "20px",
            }}
          >
            {offer.description.toLowerCase()}
          </p>

          <div
            style={{
              color: "var(--subtext)",
              fontSize: "0.9rem",
              marginBottom: showRedeemButton ? "20px" : "0",
            }}
          >
            {isExpired ? (
              <>
                <p style={{ margin: "0 0 5px 0" }}>posted: {formattedDate}</p>
                <p style={{ margin: 0 }}>
                  expired: {offer.expiryInfo.toLowerCase()}
                </p>
              </>
            ) : (
              <>
                <p style={{ margin: "0 0 5px 0" }}>posted: {formattedDate}</p>
                <p style={{ margin: 0 }}>
                  expires: {offer.expiryInfo.toLowerCase()}
                </p>
              </>
            )}
          </div>

          {showRedeemButton && (
            <button className="button" onClick={() => setRedeemOffer(offer)}>
              redeem for {offer.points} pts
            </button>
          )}
        </Card>
      </div>
    );
  };

  return (
    <>
      <main className="container wp-screen wp-anim-in mt-4 mb-5">
        <PageHeader
          title="hirewards"
          subtitle="collect and spend points earned at all your favourite hicafe brands here!"
        />

        {/* Stark Metro QR Code Block */}
        <div
          style={{
            textAlign: "center",
            background: "var(--onBackground)",
            color: "var(--background)",
            padding: "40px 20px",
            marginBottom: "40px",
          }}
        >
          <img
            src={frameImg}
            alt="QR Code"
            style={{ width: "150px", marginBottom: "15px" }}
          />
          <p
            style={{
              margin: 0,
              fontWeight: "bold",
              fontSize: "24px",
              letterSpacing: "2px",
            }}
          >
            {membershipCode}
          </p>
        </div>

        {/* Giant Swiping Pivot Headers */}
        <SubNavPills
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div>
          {isLoading ? (
            <p
              style={{
                color: "var(--subtext)",
                fontSize: "1.2rem",
                marginTop: "20px",
              }}
            >
              syncing offers...
            </p>
          ) : error ? (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ color: "var(--metro-red)", margin: "0 0 10px 0" }}>
                connection error
              </h3>
              <p style={{ color: "var(--subtext)" }}>{error.toLowerCase()}</p>
              <button className="button mt-3" onClick={fetchOffers}>
                retry
              </button>
            </div>
          ) : (
            <>
              {/* --- ACTIVE OFFERS --- */}
              {activeTab === "active" && (
                <div>
                  {activeOffers.length === 0 ? (
                    <p
                      style={{
                        color: "var(--subtext)",
                        fontSize: "1.2rem",
                        marginTop: "20px",
                      }}
                    >
                      check back later for new rewards.
                    </p>
                  ) : (
                    activeOffers.map((offer, index) =>
                      renderOfferCard(offer, false, (index % 6) + 1),
                    )
                  )}
                </div>
              )}

              {/* --- EXPIRED OFFERS --- */}
              {activeTab === "expired" && (
                <div>
                  {expiredOffers.length === 0 ? (
                    <p
                      style={{
                        color: "var(--subtext)",
                        fontSize: "1.2rem",
                        marginTop: "20px",
                      }}
                    >
                      you have no expired offers to display.
                    </p>
                  ) : (
                    expiredOffers.map((offer, index) =>
                      renderOfferCard(offer, true, (index % 6) + 1),
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Metro Modal Component */}
      <Modal isOpen={!!redeemOffer} title="redeem offer">
        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--subtext)",
            marginBottom: "30px",
            fontWeight: 300,
          }}
        >
          to redeem <strong>{redeemOffer?.title.toLowerCase()}</strong>, please
          scan your qr code at the till.
        </p>

        <button className="button" onClick={() => setRedeemOffer(null)}>
          got it
        </button>
      </Modal>
    </>
  );
}
