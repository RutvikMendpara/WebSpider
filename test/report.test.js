const { sortPages } = require("../src/report");
const { test, expect } = require("@jest/globals");

test("sortPages ", () => {
  const input = {
    "https://rutvikmendpara.com/path": 1,
    "https://rutvikmendpara.com": 3,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://rutvikmendpara.com", 3],
    ["https://rutvikmendpara.com/path", 1],
  ];
  expect(actual).toEqual(expected);
});
