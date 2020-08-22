const fetch = require('node-fetch');


k = () => fetch("https://my.ukrsibbank.com/ua/api/currency.php", {
  "headers": {
    "accept": "*/*",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,uk;q=0.6",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
    "cookie": "PHPSESSID=49rdavqnrdbb7pmt9ug1adnil1; citrix_ns_id_my.ukrsibbank.com_%2F_wat=AAAAAAW_V9t-HmE3FKv364-WAZYfgdKfLJs4Vyx2s90HUHd2-6SOgUc3jDvIJhb-k9gXPs6tsWC5Dm5AYKwNHcBw3Avn&; BX_USER_ID=8cfa9914eaecdd3396d7a22f10cf649c; _ga=GA1.3.1905824551.1596104509; _gid=GA1.3.121970026.1596104509; _gat=1"
  },
  "referrer": "https://my.ukrsibbank.com/ua/personal/cards/exchange/",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": "date=08.08.2020&type=beznal",
  "method": "POST",
  "mode": "cors"
}).then(res => res.text()).then(console.log, console.error);

c = () => fetch("https://my.ukrsibbank.com/ua/api/currency.php", {
  "headers": {
    "accept": "*/*",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  },
  "body": "date=08.08.2020&type=beznal",
  "method": "POST",
}).then(res => res.text()).then(console.log, console.error);
c();