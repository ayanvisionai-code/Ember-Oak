import React, { useEffect } from 'react';
import restaurantInfo from '../data/restaurant-info.json';
import './Legal.css';

export default function TermsConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <div className="legal__container">
        <div className="legal__header">
          <h1 className="legal__title">Terms & Conditions</h1>
          <p className="legal__updated">Last Updated: October 2023</p>
        </div>

        <div className="legal__content">
          <div className="legal__section">
            <h2>Eligibility</h2>
            <p>By accessing or using the {restaurantInfo.name} website and services, you agree to be bound by these Terms and Conditions. You must be of legal drinking age in your jurisdiction to consume alcoholic beverages at our establishment.</p>
          </div>

          <div className="legal__section">
            <h2>Welcome Gift Rules</h2>
            <p>The Welcome Gift ("Reward") is subject to the following rules and conditions:</p>
            <ul>
              <li>The Reward is available only to first-time visitors of {restaurantInfo.name}.</li>
              <li>Only one Reward may be claimed per guest.</li>
              <li>The Reward cannot be exchanged for cash or combined with other promotions or discounts.</li>
            </ul>
          </div>

          <div className="legal__section">
            <h2>Coupon Usage</h2>
            <p>To redeem the Reward, you must present the valid coupon delivered to your WhatsApp at the time of your visit, before requesting the bill. Screenshots or forwarded messages may not be accepted at the discretion of management.</p>
          </div>

          <div className="legal__section">
            <h2>Expiration Policy</h2>
            <p>Welcome Gift coupons are valid for 14 days from the date of issue unless stated otherwise on the coupon. Expired coupons will not be honored or reissued.</p>
          </div>

          <div className="legal__section">
            <h2>Reservation Policy</h2>
            <p>Reservations are highly recommended. While we strive to accommodate all guests, claiming a Welcome Gift does not guarantee a table without a prior reservation.</p>
          </div>

          <div className="legal__section">
            <h2>Restaurant Rights</h2>
            <p>{restaurantInfo.name} reserves the right to:</p>
            <ul>
              <li>Refuse service to anyone in accordance with local laws.</li>
              <li>Modify, suspend, or terminate the Welcome Gift program at any time without prior notice.</li>
              <li>Substitute the Welcome Gift with an item of equal or greater value.</li>
            </ul>
          </div>

          <div className="legal__section">
            <h2>Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, {restaurantInfo.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your access to or use of our website or services.</p>
          </div>

          <div className="legal__section">
            <h2>Contact Information</h2>
            <p>For any questions regarding these Terms and Conditions, please contact us:</p>
            <p>Email: <a href={`mailto:${restaurantInfo.email}`}>{restaurantInfo.email}</a></p>
            <p>Phone: {restaurantInfo.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
