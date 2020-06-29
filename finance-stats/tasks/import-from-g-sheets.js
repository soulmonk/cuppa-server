const fs = require('fs').promises;
const path = require('path')
const readline = require('readline');
const {google} = require('googleapis');
const { promisify } = require('util')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = process.env.TOKEN_PATH || 'token.json';
const CREDENTIALS_PATH = process.env.CREDENTIALS_PATH || 'credentials.json';
const DATA_PATH = process.env.DATA_PATH || path.join(__dirname, 'data');
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function getCredentials() {
  try {
    const content = await fs.readFile(CREDENTIALS_PATH, 'utf8');
    return JSON.parse(content)
  } catch (err) {
    console.log('Error loading client secret file:', err);
  }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  let token;
  try {
    const stat = await fs.stat(TOKEN_PATH);
    const content = await fs.readFile(TOKEN_PATH, 'utf8');
    token = JSON.parse(content)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    token = await getNewToken(oAuth2Client);
    await saveToken(token);
  }

  oAuth2Client.setCredentials(token);

  return oAuth2Client
}

async function saveToken(token) {
  await fs.writeFile(TOKEN_PATH, JSON.stringify(token))
  console.log('Token stored to', TOKEN_PATH);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject(err);
        resolve(token)
      });
    });
  })
}

async function getAllSheets(sheetsApi) {
  const { data: {sheets } } = await sheetsApi.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  })

  return sheets.map(sheet => sheet.properties.title);
}

async function fetchAndSaveRange(sheetsApi, title) {
  const {data: {values: rows }} = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: title,
  });

  await fs.writeFile(path.join(DATA_PATH, `${title}.json`), JSON.stringify(rows));
}

async function fetchData() {
  if (!SPREADSHEET_ID) {
    throw new Error('SPREADSHEET_ID required')
  }
  const credentials = await getCredentials();
  const auth = await authorize(credentials);
  const sheetsApi = google.sheets({version: 'v4', auth});

  if (process.argv[2] === 'dump') {
    const sheets = await getAllSheets(sheetsApi);
    console.log('Sheets: ', sheets.join(','))
    return;
  }

  let sheets;
  if (process.argv[2] === 'only') {
    console.log(`Fetching data for ${process.argv[3]}`)
    const sheets = process.argv[3].split(',')
  }

  if (!sheets) {
    sheets = await getAllSheets(sheetsApi);
  }

  for (let title of sheets) {
    console.log(`Sheat name ${title}`);
    await fetchAndSaveRange(sheetsApi, title)
  }
}

async function convert() {

}

async function store() {

}

async function run () {
  console.log('Start', new Date())

  // await fetchData();
  await convert();
  await store();

  console.log('Done', new Date())
}

run().catch(err => (console.error(err), -1)).then(process.exit)

