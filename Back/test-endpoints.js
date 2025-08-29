const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

async function testEndpoints() {
  try {
    console.log('🧪 Test des endpoints d\'analyse...\n');

    // Test 1: Analyse entre deux dates
    console.log('1️⃣ Test GET /analyses/analyse-periode');
    try {
      const response1 = await axios.get(`${BASE_URL}/analyses/analyse-periode?dateDebut=2024-01-01&dateFin=2024-01-31`);
      console.log('✅ Succès:', response1.status);
      console.log('📊 Données:', JSON.stringify(response1.data, null, 2));
    } catch (error) {
      console.log('❌ Erreur:', error.response?.status, error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Analyse employé entre deux dates
    console.log('2️⃣ Test GET /analyses/employe/EMP001/periode');
    try {
      const response2 = await axios.get(`${BASE_URL}/analyses/employe/EMP001/periode?dateDebut=2024-01-01&dateFin=2024-01-31`);
      console.log('✅ Succès:', response2.status);
      console.log('📊 Données:', JSON.stringify(response2.data, null, 2));
    } catch (error) {
      console.log('❌ Erreur:', error.response?.status, error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Toutes les analyses
    console.log('3️⃣ Test GET /analyses');
    try {
      const response3 = await axios.get(`${BASE_URL}/analyses`);
      console.log('✅ Succès:', response3.status);
      console.log('📊 Nombre d\'analyses:', response3.data.length);
    } catch (error) {
      console.log('❌ Erreur:', error.response?.status, error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testEndpoints();




