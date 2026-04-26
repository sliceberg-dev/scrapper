const axios = require("axios");
const cheerio = require("cheerio");

async function scrape() {
  try {
    const url = "https://www.ceneo.pl/Laptopy"; // przykładowa strona
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const products = [];

    $(".cat-prod-row").each((i, el) => {
      const name = $(el).find(".cat-prod-row__name").text().trim();
      const price = $(el).find(".price").text().trim();
      const rating = $(el).find(".review-score").text().trim();

      products.push({ name, price, rating });
    });

    console.log(products);
  } catch (err) {
    console.error("Błąd:", err.message);
  }
}

scrape();