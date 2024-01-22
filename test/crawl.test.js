const { normalizeURL, getURLSFromHTML } = require("../src/crawl");
const { test, expect } = require("@jest/globals");

test("normalizeURL strip protocol HTTPS", () => {
  const input = "https://rutvikmendpara.com";
  const actual = normalizeURL(input);
  const expected = "rutvikmendpara.com";
  expect(actual).toEqual(expected);
});
test("normalizeURL strip www", () => {
  const input = "https://www.rutvikmendpara.com";
  const actual = normalizeURL(input);
  const expected = "rutvikmendpara.com";
  expect(actual).toEqual(expected);
});
test("normalizeURL strip www with trailing slash ", () => {
  const input = "https://www.rutvikmendpara.com";
  const actual = normalizeURL(input);
  const expected = "rutvikmendpara.com";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip protocol HTTP", () => {
  const input = "http://rutvikmendpara.com";
  const actual = normalizeURL(input);
  const expected = "rutvikmendpara.com";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip trailing slash", () => {
  const input = "https://rutvikmendpara.com/blogs/";
  const actual = normalizeURL(input);
  const expected = "rutvikmendpara.com/blogs";
  expect(actual).toEqual(expected);
});

test("normalizeURL capitals", () => {
  const input = "https://RutvikMendpara.com/BLOGS/";
  const actual = normalizeURL(input);
  const expected = "rutvikmendpara.com/blogs";
  expect(actual).toEqual(expected);
});

test("getURLSFromHTML", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="https://rutvikmendpara.com/"> Rutvik </a>
    </body>
  </html>`;
  const inputBaseURL = "https://rutvikmendpara.com/";
  const actual = getURLSFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["rutvikmendpara.com"];
  expect(actual).toEqual(expected);
});

test("getURLSFromHTML multi href elements", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="https://rutvikmendpara.com/"> Rutvik </a>
      <a href="https://rutvikmendpara.com/blog"> Rutvik </a>
    </body>
  </html>`;
  const inputBaseURL = "https://rutvikmendpara.com/";
  const actual = getURLSFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["rutvikmendpara.com", "rutvikmendpara.com/blog"];
  expect(actual).toEqual(expected);
});

test("getURLSFromHTML relative url", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="/blogs/"> Rutvik </a>
    </body>
  </html>`;
  const inputBaseURL = "https://rutvikmendpara.com/";
  const actual = getURLSFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["rutvikmendpara.com/blogs"];
  expect(actual).toEqual(expected);
});

test("getURLSFromHTML absolute + relative urls", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="/blogs/"> blogs </a>
      <a href="/news"> news </a>
      <a href="https://rutvikmendpara.com/blogs/1"> blog1 </a>
      <a href="https://rutvikmendpara.com/blogs/2/"> blog2 </a>
   
    </body>
  </html>`;
  const inputBaseURL = "https://rutvikmendpara.com/";
  const actual = getURLSFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    "rutvikmendpara.com/blogs",
    "rutvikmendpara.com/news",
    "rutvikmendpara.com/blogs/1",
    "rutvikmendpara.com/blogs/2",
  ];
  expect(actual).toEqual(expected);
});

test("getURLSFromHTML invalid url", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="invalid"> Rutvik </a>
    </body>
  </html>`;
  const inputBaseURL = "https://rutvikmendpara.com/";
  const actual = getURLSFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});
