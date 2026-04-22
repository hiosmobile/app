import React from "react";
import { Card } from "../../../components/HiMaterial";
import ScrollTop from "../../assets/buttons/scrolltop.bmp";

export default function PrivacyPolicy() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    const rootDiv = document.getElementById("root");
    if (rootDiv) rootDiv.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container mt-4 mb-5">
      <Card bodyClass="text-start">
        <div className="top-container">
          <h1 className="blue-h2 mb-0">
            <span className="titleIcon material-symbols-rounded">
              shield_person
            </span>
            Privacy Policy
          </h1>
        </div>
      </Card>

      <Card className="mt-2 joinTop" bodyClass="text-start p-4">
        <h6 className="mb-4">
          <b>Last Updated:</b> April 8th, 2025
        </h6>

        <p>
          This Privacy Policy outlines the collection, use, and protection of
          personal information when you use HiOSMobile for Android, and
          HiOSMobile for Web, open-source applications created by HiOSMobile and
          The Highland Cafe™️ Enterprises ("we," "our," or "us"). By
          downloading, installing, or using these applications, you agree to the
          practices described in this policy.
        </p>

        <h2 className="mt-4">1. Information We Collect</h2>
        <p>
          1.1 <b>Personal Information:</b> We do not collect information about
          you. The only personal information that is collected is collected by
          The Highland Cafe™️, and is information you give us, via our in-app
          forms. GitHub, who we use to host HiOSWebCore, does not collect any
          information at all.
        </p>
        <p>
          1.2 <b>Non-Personal Information:</b> We don't collect any non-personal
          information.
        </p>

        <h2 className="mt-4">2. How We Use Your Information</h2>
        <p>
          2.1 <b>Personal Information:</b> We may use your personal information
          for the following purposes:
        </p>
        <ul>
          <li>
            To communicate with you, respond to inquiries, and provide customer
            support.
          </li>
          <li>
            To send you important updates, notifications, and information
            related to the apps.
          </li>
          <li>To improve our services and apps.</li>
        </ul>
        <p>
          2.2 <b>Non-Personal Information:</b> Again, we don't collect any
          non-personal information.
        </p>

        <h2 className="mt-4">3. Sharing Your Information</h2>
        <p>
          We do not sell, trade, or rent your personal information to third
          parties. However, we may share your information in the following
          circumstances:
        </p>
        <ul>
          <li>With your explicit consent.</li>
          <li>If required by law or in response to a valid legal request.</li>
          <li>
            To protect our rights, privacy, safety, or property or that of our
            users or the public.
          </li>
          <li>
            In connection with the sale, merger, or acquisition of all or part
            of our company, as permitted by law.
          </li>
        </ul>

        <h2 className="mt-4">4. Data Security</h2>
        <p>
          We are committed to protecting your information and employ reasonable
          security measures to safeguard your data. However, no method of
          transmission over the internet or electronic storage is 100% secure,
          so we cannot guarantee absolute security.
        </p>

        <h2 className="mt-4">5. Your Choices</h2>
        <p>
          You have the following rights regarding your personal information:
        </p>
        <ul>
          <li>
            To speak to us via customer support to do a search on your data,
            then go on from there on your request.
          </li>
          <li>
            To request the deletion of your personal information, via above
            method.
          </li>
        </ul>

        <h2 className="mt-4">6. Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy as needed to reflect changes in our
          practices or for other operational, legal, or regulatory reasons. Any
          changes will be posted on this page, and the "Last Updated" date will
          be revised accordingly.
        </p>

        <h2 className="mt-4">7. Contact Us</h2>
        <p>
          If you have questions or concerns about this Privacy Policy or our
          data practices, please contact us via the HiOSMobile app at Help &gt;
          Customer Support, or via our Customer Support page.
        </p>

        <h3 className="mt-5 text-center">
          <i>
            <u>This is the end of the HiOSMobile Privacy Policy.</u>
          </i>
        </h3>

        <div className="text-center mt-4">
          <img
            src={ScrollTop}
            alt="Scroll Top"
            className="roundedImage"
            style={{ cursor: "pointer" }}
            onClick={scrollToTop}
            role="button"
          />
        </div>
      </Card>
    </main>
  );
}
