const { normalizeURL } = require("../src/crawl");
const { test, expect } = require("@jest/globals");

test("normalizeURL strip protocol HTTPS", () => {
  const input = "https://rutvikmendpara.com";
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
