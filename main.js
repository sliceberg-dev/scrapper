const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(
            'https://store.steampowered.com/search/?term='
        );

        const $ = cheerio.load(response.data);

        const games = [];

        $('.search_result_row').each((i, el) => {

            const title = $(el).find('.title').text().trim();

            const price =
                $(el)
                    .find('.discount_final_price')
                    .text()
                    .trim() ||
                $(el)
                    .find('.search_price')
                    .text()
                    .trim();

            const link = $(el).attr('href');

            if (title) {
                games.push({
                    title,
                    price: price || 'Brak ceny',
                    link
                });
            }
        });

        let html = `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
            <meta charset="UTF-8">
            <title>Steam Scraper</title>

            <style>
                body{
                    font-family: Arial;
                    margin:20px;
                }

                table{
                    width:100%;
                    border-collapse:collapse;
                }

                th,td{
                    border:1px solid #ddd;
                    padding:10px;
                }

                th{
                    background:#f4f4f4;
                }

                tr:nth-child(even){
                    background:#fafafa;
                }

                a{
                    color:#0066cc;
                }
            </style>
        </head>
        <body>

        <h1>Lista gier Steam</h1>

        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Gra</th>
                    <th>Cena</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
        `;

        games.forEach((game, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${game.title}</td>
                    <td>${game.price}</td>
                    <td>
                        <a href="${game.link}" target="_blank">
                            Otwórz
                        </a>
                    </td>
                </tr>
            `;
        });

        html += `
            </tbody>
        </table>

        </body>
        </html>
        `;

        res.send(html);

    } catch (error) {
        res.send(`
            <h2>Błąd podczas pobierania danych</h2>
            <pre>${error.message}</pre>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Serwer działa: http://localhost:${PORT}`);
});