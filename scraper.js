const axios = require('axios');
const cheerio = require('cheerio');

async function scrape() {
  try {
    const response = await axios.get('https://store.steampowered.com/search?term=');

    const $ = cheerio.load(response.data);

    console.log('Pobrane informacje:');

    $('.title').each((i, el) => {
      console.log($(el).text().trim());
    });

  } catch (err) {
    console.error('Błąd:', err.message);
  }
}

scrape();