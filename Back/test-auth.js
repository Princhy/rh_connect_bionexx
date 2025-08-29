const http = require('http');

const BASE_URL = 'http://localhost:8000';

function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAuth() {
  try {
    console.log('🔐 Test d\'authentification...\n');

    // Test 1: Endpoint sans authentification (devrait marcher)
    console.log('1️⃣ Test GET /analyses (sans auth)');
    try {
      const response1 = await makeRequest('/analyses');
      console.log('✅ Succès:', response1.status);
    } catch (error) {
      console.log('❌ Erreur:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Endpoint analyse-periode (devrait marcher sans auth)
    console.log('2️⃣ Test GET /analyses/analyse-periode (sans auth)');
    try {
      const response2 = await makeRequest('/analyses/analyse-periode?dateDebut=2024-01-01&dateFin=2024-01-31');
      console.log('✅ Succès:', response2.status);
      console.log('📊 Données:', typeof response2.data === 'string' ? response2.data.substring(0, 200) + '...' : JSON.stringify(response2.data, null, 2));
    } catch (error) {
      console.log('❌ Erreur:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Endpoint avec authentification (devrait échouer sans token)
    console.log('3️⃣ Test GET /analyses/retards/2024-01-15 (avec auth)');
    try {
      const response3 = await makeRequest('/analyses/retards/2024-01-15');
      console.log('✅ Succès:', response3.status);
    } catch (error) {
      console.log('❌ Erreur:', error.message);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testAuth();



