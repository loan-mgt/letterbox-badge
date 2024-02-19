const express = require('express');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

const svgFilePath = '/source.svg';

const initialSvgContent = `<svg width="360" height="180" viewBox="0 0 360 180" fill="none" xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="360" height="180" rx="30" fill="url(#pattern0)" />
<g filter="url(#filter0_d_1_19)">
    <rect x="20" y="37" width="70" height="105" fill="url(#pattern1)"
        shape-rendering="crispEdges" />
</g>
<text id="starts" fill="white" xml:space="preserve" style="white-space: pre" font-family="Inter"
    font-size="32" letter-spacing="0em"><tspan x="100" y="136.636">&#x2605;&#x2605;&#x2605;&#x2605;</tspan></text>
<text id="title" fill="white" xml:space="preserve" style="white-space: pre" font-family="Inter"
    font-size="27" letter-spacing="0em"><tspan x="100" y="61.3182">All of Us Strangers</tspan></text>
<text id="date" fill="white" fill-opacity="0.65" xml:space="preserve" style="white-space: pre"
    font-family="Inter" font-size="16" letter-spacing="0em"><tspan x="100" y="83.3182">2024</tspan></text>
<defs>
    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#background_image" transform="scale(0.00277778 0.00555556)" />
    </pattern>
    <filter id="filter0_d_1_19" x="4" y="21" width="102" height="137"
        filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feMorphology radius="6" operator="dilate" in="SourceAlpha"
            result="effect1_dropShadow_1_19" />
        <feOffset />
        <feGaussianBlur stdDeviation="5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_19" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_19" result="shape" />
    </filter>
    <pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#film_cover_small" transform="scale(0.0142857 0.00952381)" />
    </pattern>
    <image id="background_image" width="360" height="180"
        xlink:href="data:image/png;base64,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" 
         />
    <image id="film_cover_small" width="70" height="105"
        xlink:href="" />
</defs>
</svg>`

function generateUpdatedSvg(svgFilePath, newTitle, newDate, newStars, newFilmCoverURL) {
  // Read the SVG file
  //onst svgFile = fs.readFileSync(svgFilePath, 'utf-8');

  // Load the SVG content into Cheerio
  //const $ = cheerio.load(svgFilePath, { xmlMode: true });
  const $ = cheerio.load(initialSvgContent, { xmlMode: true });

  // Update film title, date, and stars
  $('#title tspan').text(newTitle);
  $('#date tspan').text(newDate); // Update the year
  $('#starts tspan').text(newStars); // Update the stars

  // Update film cover image
  $('#film_cover_small').attr('xlink:href', newFilmCoverURL);

  // Return the modified SVG content
  return $.xml();
}

async function getLatestActivityDetails(username) {
  const activityUrl = `https://letterboxd.com/ajax/activity-pagination/${username}`;
  try {
    // Fetch the HTML content from the provided URL
    const response = await axios.get(activityUrl);
    const html = response.data;

    // Load the HTML content into Cheerio
    const $ = cheerio.load(html);

    // Find the latest activity section
    const latestActivitySection = $('.activity-row.-review').first();

    // Extract film details from the latest activity
    const filmTitle = latestActivitySection.find('.headline-2 > a').text().trim();
    const filmYear = latestActivitySection.find('.headline-2 > small > a').text().trim();
    const stars = latestActivitySection.find('.film-detail-meta .rating').text().trim();

    // Return the extracted details as an object
    return {
      title: filmTitle,
      filmYear: filmYear,
      stars: stars,
    };
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }
}

app.get('/', async (req, res) => {
    res.send('Hello! please use /:username');
});

app.get('/:username', async (req, res) => {
  const username = req.params.username;

  const result = await getLatestActivityDetails(username);

  if (result) {
    const newFilmCoverURL = 'https://a.ltrbxd.com/resized/film-poster/8/7/9/3/2/0/879320-the-deep-dark-0-70-0-105-crop.jpg?v=d923579b15';

    const updatedSvgContent = generateUpdatedSvg(svgFilePath, result.title, result.filmYear, result.stars, newFilmCoverURL);

    // Set the response content type to SVG
    res.contentType('image/svg+xml');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    
    // Send the modified SVG content as the response
    res.send(updatedSvgContent);

    console.log('SVG sent successfully.');
  } else {
    res.status(404).send('Failed to retrieve activity details.');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
