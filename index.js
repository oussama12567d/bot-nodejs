const express = require('express')
const axios = require('axios');
const cheerio = require('cheerio');
const app = express()
const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.listen(4000, () => {
  console.log(
    `Server is running on http://localhost:${4000}`
  );
});


app.get('/', (req, res) =>{
  res.send('hi')
})
app.post("/getp",async (req, res) => {
  const url = req.body.url
  const message = await getHTMLContent(url)
  res.send(message)});
async function getHTMLContent(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      const scriptRegex = /<script.*?>[\s\S]*?<\/script>/g;
      const scriptMatch = html.match(scriptRegex);
      const scriptContents = scriptMatch ? scriptMatch[0] : '';

      const start = scriptContents.indexOf('"feedbackComponent"');
      const end = scriptContents.indexOf('}', start) + 1;
      const runParams = scriptContents.slice(start, end);

      const runParamsJson = '{' + runParams + '}';
      const runParamsObj = JSON.parse(runParamsJson);

      const everagestar = runParamsObj.feedbackComponent.evarageStar;
      const positive = runParamsObj.feedbackComponent.fiveStarNum + runParamsObj.feedbackComponent.fourStarNum;
      const negative = runParamsObj.feedbackComponent.oneStarNum + runParamsObj.feedbackComponent.twoStarNum;

      const start3 = scriptContents.indexOf('"formatTradeCount"');
      const end3 = scriptContents.indexOf(',', start3);
      const tradeCount = scriptContents.slice(start3, end3);
      const tradeCountJson = '{' + tradeCount + '}';
      const tradeCountObj = JSON.parse(tradeCountJson);
      const trade = tradeCountObj.formatTradeCount;

      const start2 = scriptContents.indexOf('"sellerPositiveRate"');
      const end2 = scriptContents.indexOf(',', start2);
      const sellerPositiveRate = scriptContents.slice(start2, end2);
      const sellerPositiveRateJson = '{' + sellerPositiveRate + '}';
      const sellerPositiveRateObj = JSON.parse(sellerPositiveRateJson);
      const positiveRate = sellerPositiveRateObj.sellerPositiveRate;

      const start1 = scriptContents.indexOf('"storeName"');
      const end1 = scriptContents.indexOf(',', start1);
      const storeName = scriptContents.slice(start1, end1);
      const storeNameJson = '{' + storeName + '}';
      const storeNameObj = JSON.parse(storeNameJson);
      const store = storeNameObj.storeName;

      const start4 = scriptContents.indexOf('"imagePathList"');
      const end4 = scriptContents.indexOf(',', start4);
      const imageList = scriptContents.slice(start4, end4) + ']';
      const imageListJson = '{' + imageList + '}';
      const imageListObj = JSON.parse(imageListJson);
      const image = imageListObj.imagePathList[0];

      const start5 = scriptContents.indexOf('"subject"');
      const end5 = scriptContents.indexOf(',', start5);
      const subjectContent = scriptContents.slice(start5, end5);
      const subjectJson = '{' + subjectContent + '}';
      const subjectObj = JSON.parse(subjectJson);
      const subject = subjectObj.subject;

      const details = {
          'everagestar': everagestar,
          'positive': positive,
          'negative': negative,
          'trade': trade,
          'positive_rate': positiveRate,
          'store': store,
          'image': image,
          'subject': subject
      };
console.log(details)
      return formatProductInfo(details);
  } catch (error) {
      console.error(`Error fetching HTML content: ${error}`);
      return null;
  }
}


function formatProductInfo(productInfo) {
// Construct the message with product information and image
const message = `
  Product Name: ${productInfo.subject}
  Average Rating: ${productInfo.everagestar}
  Positive Reviews: ${productInfo.positive}
  Negative Reviews: ${productInfo.negative}
  Positive Rate: ${productInfo.positive_rate}%
  Store: ${productInfo.store}
  Trade Count: ${productInfo.trade}
  Image: ${productInfo.image}
`;
return message;
}
