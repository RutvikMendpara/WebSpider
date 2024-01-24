const { JSDOM } = require("jsdom");

function normalizeURL(urlString) {
  const urlObj = new URL(urlString.toLowerCase());
  const hostName = `${urlObj.hostname}${urlObj.pathname}`;

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

async function crawlPage(BaseURL, currentURL, pages) {
  const baseURLObj = new URL(BaseURL);
  const currentURLObj = new URL(currentURL);

  // only go for same hostname, it will skip other hostname page
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);

  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  pages[normalizedCurrentURL] = 1;
  console.log(`actively crawling : ${currentURL}`);

  try {
    // Check if the URL is missing the protocol and prepend "http://" if needed

    const response = await fetch(currentURL);

    if (response.status > 399) {
      console.log(
        `error in fetch with status code : ${response.status} on page: ${currentURL}`
      );

      return;
    }

    const contentType = response.headers.get("content-type");
    // if (!contentType.includes("text/html")) {
    //   console.log(
    //     `non html response, content type: ${contentType}, on page: ${currentURL}`
    //   );
    //   return;
    // }

    const htmlBody = await response.text();

    const nextURLs = getURLSFromHTML(htmlBody, BaseURL);
    try {
      for (const nextURL of nextURLs) {
        let fullNextURL = nextURL;
        if (nextURL && !nextURL.startsWith("https")) {
          fullNextURL = `https://${nextURL}`;
        }

        if (BaseURL && fullNextURL) {
          pages = await crawlPage(BaseURL, fullNextURL, pages);
        }
      }
    } catch (error) {
      console.log(`error in fetch: ${error.message} on page: ${currentURL}`);
    }
  } catch (error) {
    console.log(`error in fetch: ${error.message} on page: ${currentURL}`);
  }

  return pages;
}

module.exports = {
  normalizeURL,
  getURLSFromHTML,
  crawlPage,
};
