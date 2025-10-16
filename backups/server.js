// Usage: node upload-to-drive.js <localFilePath> <remoteFileName> <gdriveFolderId>

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const SCRIPT_DIR = __dirname;
const CREDENTIALS_PATH = path.join(SCRIPT_DIR, 'credentials.json');
const TOKEN_PATH = path.join(SCRIPT_DIR, 'token.json');

async function authenticate() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8')));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });
  console.log('Authorize this app by visiting this url:', authUrl);

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    readline.question('Enter the code from that page here: ', (code) => {
      readline.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject(err);
        oAuth2Client.setCredentials(token);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to', TOKEN_PATH);
        resolve(oAuth2Client);
      });
    });
  });
}

async function uploadFile(auth, localFilePath, remoteFileName, folderId) {
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    name: remoteFileName,
    parents: [folderId],
  };
  const media = {
    mimeType: 'application/sql',
    body: fs.createReadStream(localFilePath),
  };
  const res = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });
  console.log('File uploaded, ID:', res.data.id);
}

async function main() {
  if (process.argv.length !== 5) {
    console.error('Usage: node upload-to-drive.js <localFilePath> <remoteFileName> <gdriveFolderId>');
    process.exit(1);
  }
  const localFilePath = process.argv[2];
  const remoteFileName = process.argv[3];
  const folderId = process.argv[4];

  const auth = await authenticate();
  await uploadFile(auth, localFilePath, remoteFileName, folderId);
}

main().catch(console.error);