/**
 * This util securely opens links in the system's default web browser -- so if the user has it set to Edge for instance, it opens in Edge. Or Chrome for most people.
 * @param {string} url - the full url to open.
 */

import { Browser } from "@capacitor/browser";

export const openExternalLink = async (url) => {
  try {
    await Browser.open({ url });
  } catch (error) {
    console.error("Could not open the external link:", error);
    //fallback for the browser if capacitor is for whatever reason not present.
    window.open(url, "_blank");
  }
};
