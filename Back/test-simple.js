const http = require('http');

const BASE_URL = 'http://localhost:8000';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
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

async function testEndpoints() {
  try {
    console.log('🧪 Test des endpoints d\'analyse...\n');

    // Test 1: Toutes les analyses
    console.log('1️⃣ Test GET /analyses');
    try {
      const response1 = await makeRequest('/analyses');
      console.log('✅ Succès:', response1.status);
      console.log('📊 Nombre d\'analyses:', Array.isArray(response1.data) ? response1.data.length : 'N/A');
      console.log('📄 Données:', JSON.stringify(response1.data, null, 2).substring(0, 500) + '...');
    } catch (error) {
      console.log('❌ Erreur:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Analyse entre deux dates
    console.log('2️⃣ Test GET /analyses/analyse-periode');
    try {
      const response2 = await makeRequest('/analyses/analyse-periode?dateDebut=2024-01-01&dateFin=2024-01-31');
      console.log('✅ Succès:', response2.status);
      console.log('📊 Données:', JSON.stringify(response2.data, null, 2));
    } catch (error) {
      console.log('❌ Erreur:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Analyse employé entre deux dates (si des données existent)
    console.log('3️⃣ Test GET /analyses/employe/EMP001/periode');
    try {
      const response3 = await makeRequest('/analyses/employe/EMP001/periode?dateDebut=2024-01-01&dateFin=2024-01-31');
      console.log('✅ Succès:', response3.status);
      console.log('📊 Données:', JSON.stringify(response3.data, null, 2));
    } catch (error) {
      console.log('❌ Erreur:', error.message);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testEndpoints();




