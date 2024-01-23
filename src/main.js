const { crawlPage, getURLSFromHTML } = require("./crawl");

async function main() {
  if (process.argv.length < 3) {
    console.log("no website found");
    process.exit(1);
  }
  if (process.argv.length > 3) {
    console.log("too many command line args");
    process.exit(1);
  }

  const BaseURL = process.argv[2];
  console.log(`starting crawl of ${BaseURL}`);
  const pages = await crawlPage(BaseURL, BaseURL, {});

  if (pages) {
    for (const page of Object.entries(pages)) {
      console.log(page);
    }
  } else {
    console.log("Error in crawling. Pages object is undefined.");
  }
}

main();
