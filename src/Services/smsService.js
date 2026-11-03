
/**
 * SMS Service
 * Provider: GoMsg (integration pending)
 *
 * GoMsg API endpoint and request format will be added
 * after receiving the official API documentation.
 */

const SMS_PROVIDER = (process.env.SMS_PROVIDER || "").toLowerCase();

const GOMSG_API_URL = process.env.GOMSG_API_URL || "";
const GOMSG_API_KEY = process.env.GOMSG_API_KEY || "";
const GOMSG_SENDER_ID = process.env.GOMSG_SENDER_ID || "";
const GOMSG_TEMPLATE_ID = process.env.GOMSG_TEMPLATE_ID || "";

/**
 * Checks whether the SMS provider is ready.
 *
 * Keep false until the actual GoMsg API integration
 * has been implemented and verified.
 */
const isConfigured = () => {
  return false;
};

/**
 * Sends an SMS.
 *
 * @param {string} mobile - Recipient mobile number
 * @param {string} message - SMS message
 */
const sendSms = async (mobile, message) => {
  if (!isConfigured()) {
    throw new Error("SMS service is not configured yet.");
  }

  if (SMS_PROVIDER === "goms") {
    // TODO: Implement using the official GoMsg API documentation.
    throw new Error("GoMsg integration is pending.");
  }

  throw new Error("Unsupported SMS provider.");
};

module.exports = {
  isConfigured,
  sendSms,
};
