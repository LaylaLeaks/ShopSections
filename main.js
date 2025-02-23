require('dotenv').config();
const axios = require("axios");
const fs = require("fs");

const ignorePath = "./ignore.json";
const { custom, api } = require("./config/config")
const { twitterClient } = require("./config/twitterClient")
console.log("\x1b[35mThanks for using this bot!\nTo support me leave a star or follow me on twitter @layla_leaks <3\x1b[0m\n");

function loadFilter() {
  try {
    if (fs.existsSync(ignorePath)) {
      const ignoreContent = fs.readFileSync(ignorePath, "utf8");
      const ignoreData = JSON.parse(ignoreContent);
      return ignoreData.filterList || [];
    }
  } catch (error) {
    console.error("Error loading ignore.json:", error);
  }
  return [];
}

async function shopSections() {
  try {
    let currentData = [];
    const sectionPath = "./cache.json";

    if (fs.existsSync(sectionPath)) {
      const sectionContent = fs.readFileSync(sectionPath, "utf8");
      currentData = JSON.parse(sectionContent);
    }

    const response = await axios.get(api.api);
    const data = response.data;

    const filterList = loadFilter();

    const currentSections = data.shopData.sections.map((section) => {
        const offerGroups = section.metadata?.offerGroups || [];
        const offerGroupCount = offerGroups.length;
  
        return {
          sectionID: section.sectionID,
          displayName: section.displayName,
          offerGroupCount: offerGroupCount,
        };
    })
    .filter(section => !filterList.includes(section.displayName)); // filtered specific sections

    const newSections = currentSections.filter(
      (current) => !currentData.some((previous) => previous.sectionID === current.sectionID)
    );

    if (newSections.length > 0) {
      console.log(`NEW SHOP SECTION FOUND!`);

      fs.writeFileSync(sectionPath, JSON.stringify(currentSections, null, 2), "utf8");

      let twitterText = `${custom.header}\n\n`;

      for (const section of newSections) {
        const sectionOffers = `x${section.offerGroupCount}`
        twitterText += `${custom.start} ${section.displayName} ${sectionOffers}\n`;
      }

      // twitter post
      const tweet = async () => {
        try {
            await twitterClient.v2.tweet({
                text: twitterText.trim(),
            });

            console.log(`New Shop Sections sent to Twitter`);
        } catch (error) {
            console.error(`Error while sending Shop Sections to twitter: ${error}`);
        }
      }

      tweet();
    } else {
      console.log(`No new shop section`);
    }
  } catch (error) {
    console.error(`Error while tracking shop sections: ${error}`);
  }
}

shopSections(); // first call

(async () => { await setInterval(shopSections, 60000) })(); // next calls all 60 sec

/* 
 * if you have any issues or problems join my discord server
 * https://discord.com/invite/3AUtgD8sWy
*/