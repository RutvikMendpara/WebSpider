const { JSDOM } = require("jsdom");

function normalizeURL(urlString) {
  const urlObj = new URL(urlString.toLowerCase());
  const hostName = `${urlObj.hostname}${urlObj.pathname}`;

  if (hostName.length > 0 && hostName.startsWith("www")) {
    return hostName.slice(4, -1);
  }

  if (hostName.length > 0 && hostName.slice(-1) === "/") {
    return hostName.slice(0, -1);
  }
  return hostName;
}

function getURLSFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      const base = normalizeURL(baseURL);
      // relative
      const newURL = `${base}${linkElement.href}`;
      if (newURL.slice(-1) === "/") {
        urls.push(newURL.slice(0, -1));
      } else {
        urls.push(newURL);
      }
    } else {
      // absolute
      try {
        urls.push(normalizeURL(linkElement.href));
      } catch (error) {
        return [];
      }
    }
  }
  return urls;
}

module.exports = {
  normalizeURL,
  getURLSFromHTML,
};
