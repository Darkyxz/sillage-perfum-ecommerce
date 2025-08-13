// Script para probar subida de imagen a endpoint PHP desde Node.js
// Usa solo dependencias ya presentes en el proyecto (express, multer, mysql2, etc. pero no axios/node-fetch)
// Utiliza test-image.jpg en la misma carpeta

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BOUNDARY = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const CRLF = '\r\n';

const filePath = path.join(__dirname, 'test-image.jpg');
const fileName = 'test-image.jpg';
const uploadUrl = 'https://sillageperfum.cl/api-proxy.php?action=upload-image';

function buildMultipartBody() {
  const fileContent = fs.readFileSync(filePath);
  let body = '';
  body += `--${BOUNDARY}${CRLF}`;
  body += `Content-Disposition: form-data; name=\"image\"; filename=\"${fileName}\"${CRLF}`;
  body += `Content-Type: image/jpeg${CRLF}${CRLF}`;
  const preFile = Buffer.from(body, 'utf8');
  const postFile = Buffer.from(`${CRLF}--${BOUNDARY}--${CRLF}`, 'utf8');
  return Buffer.concat([preFile, fileContent, postFile]);
}

function uploadImage() {
  const body = buildMultipartBody();
  const url = new URL(uploadUrl);
  const options = {
    method: 'POST',
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${BOUNDARY}`,
      'Content-Length': body.length,
    },
  };
  const proto = url.protocol === 'https:' ? https : http;
  const req = proto.request(options, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      console.log(`\nStatus: ${res.statusCode}`);
      console.log('Headers:', res.headers);
      console.log('Response:', data);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('\n✅ Subida exitosa.');
        process.exit(0);
      } else {
        console.error('\n❌ Fallo en la subida.');
        process.exit(1);
      }
    });
  });
  req.on('error', (err) => {
    console.error('❌ Error de red:', err.message);
    process.exit(2);
  });
  req.write(body);
  req.end();
}

if (!fs.existsSync(filePath)) {
  console.error('❌ No se encontró test-image.jpg en la carpeta.');
  process.exit(3);
}

console.log('Subiendo test-image.jpg a', uploadUrl);
uploadImage();
