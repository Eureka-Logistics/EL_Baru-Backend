// Test script untuk API Tarif dengan Konfirmasi
// Pastikan server berjalan di localhost:3000 atau sesuaikan dengan port yang digunakan

const axios = require('axios');

const BASE_URL = 'http://localhost:3000'; // Sesuaikan dengan URL server Anda
const AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE'; // Ganti dengan token autentikasi yang valid

// Headers untuk request
const headers = {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
};

// Test data untuk tarif customer
const tarifCustomerData = {
    id_muat_kota: 1,
    id_tujuan_kota: 2,
    id_customer: 3,
    id_kendaraan_jenis: 1,
    service_type: "retailer",
    via: "darat",
    jenis_kiriman: "barang",
    biaya_jalan: 50000,
    kode_surat: "TEST001",
    diskon_percent: 0,
    diskon_rupiah: 0,
    total_biaya: 50000,
    biaya_muat: 10000,
    biaya_bongkar: 10000,
    biaya_overtonase: 0,
    biaya_multimuat: 0,
    biaya_multidrop: 0,
    biaya_mel: 0,
    biaya_tambahan: 0,
    biaya_lain: 0,
    min_tonas_1: 1,
    min_tonase_2: 5,
    min_tonase_3: 10,
    min_tonase_4: 15,
    min_tonase_5: 20,
    tarif_2: 45000,
    tarif_3: 40000,
    tarif_4: 35000,
    tarif_5: 30000,
    id_bu_branch: 1
};

// Test data untuk tarif eureka
const tarifEurekaData = {
    id_muat_kota: 1,
    id_tujuan_kota: 2,
    id_kendaraan_jenis: 1,
    service_type: "retailer",
    via: "darat",
    jenis_kiriman: "barang",
    tarif: 50000,
    maintenance_cost: 5000,
    variable_cost: 3000,
    fixed_cost: 2000,
    amount: 0,
    percent: 0,
    ritase: 1,
    max_tonase: 10,
    satuan: "kg",
    harga_selanjutnya: 45000,
    uang_jalan: 10000
};

// Test data untuk tarif mitra
const tarifMitraData = {
    id_muat_kota: 1,
    id_tujuan_kota: 2,
    id_kendaraan_jenis: 1,
    id_mitra: 5,
    service_type: "retailer",
    via: "darat",
    jenis_kiriman: "barang",
    max_tonase: 10,
    tarif: 45000,
    ritase: 1,
    uang_jalan: 10000,
    kode_surat: "TEST002"
};

// Test functions
async function testTarifCustomerConfirmation() {
    console.log('\n=== Testing Tarif Customer Confirmation ===');
    
    try {
        // Test 1: Create tarif customer dengan konfirmasi
        console.log('1. Testing create tarif customer dengan konfirmasi...');
        const response1 = await axios.post(
            `${BASE_URL}/tarif/create-tarifCustomer-confirmation`,
            tarifCustomerData,
            { headers }
        );
        
        console.log('Response:', response1.data);
        
        if (response1.data.status.code === 409) {
            console.log('Tarif sudah ada, testing replace...');
            
            // Test 2: Replace tarif customer
            const replaceData = {
                ...tarifCustomerData,
                existingTarifId: response1.data.data.existingTarifId,
                confirmReplace: 'yes',
                biaya_jalan: 55000, // Harga baru
                kode_surat: 'TEST003' // Surat baru
            };
            
            const response2 = await axios.post(
                `${BASE_URL}/tarif/replace-tarifCustomer`,
                replaceData,
                { headers }
            );
            
            console.log('Replace Response:', response2.data);
        }
        
    } catch (error) {
        console.error('Error testing tarif customer:', error.response?.data || error.message);
    }
}

async function testTarifEurekaConfirmation() {
    console.log('\n=== Testing Tarif Eureka Confirmation ===');
    
    try {
        // Test 1: Create tarif eureka dengan konfirmasi
        console.log('1. Testing create tarif eureka dengan konfirmasi...');
        const response1 = await axios.post(
            `${BASE_URL}/tarif/create-tarifEureka-confirmation`,
            tarifEurekaData,
            { headers }
        );
        
        console.log('Response:', response1.data);
        
        if (response1.data.status.code === 409) {
            console.log('Tarif sudah ada, testing replace...');
            
            // Test 2: Replace tarif eureka
            const replaceData = {
                ...tarifEurekaData,
                existingTarifId: response1.data.data.existingTarifId,
                confirmReplace: 'yes',
                tarif: 55000 // Harga baru
            };
            
            const response2 = await axios.post(
                `${BASE_URL}/tarif/replace-tarifEureka`,
                replaceData,
                { headers }
            );
            
            console.log('Replace Response:', response2.data);
        }
        
    } catch (error) {
        console.error('Error testing tarif eureka:', error.response?.data || error.message);
    }
}

async function testTarifMitraConfirmation() {
    console.log('\n=== Testing Tarif Mitra Confirmation ===');
    
    try {
        // Test 1: Create tarif mitra dengan konfirmasi
        console.log('1. Testing create tarif mitra dengan konfirmasi...');
        const response1 = await axios.post(
            `${BASE_URL}/tarif/create-tarifMitra-confirmation`,
            tarifMitraData,
            { headers }
        );
        
        console.log('Response:', response1.data);
        
        if (response1.data.status.code === 409) {
            console.log('Tarif sudah ada, testing replace...');
            
            // Test 2: Replace tarif mitra
            const replaceData = {
                ...tarifMitraData,
                existingTarifId: response1.data.data.existingTarifId,
                confirmReplace: 'yes',
                tarif: 50000, // Harga baru
                kode_surat: 'TEST004' // Surat baru
            };
            
            const response2 = await axios.post(
                `${BASE_URL}/tarif/replace-tarifMitra`,
                replaceData,
                { headers }
            );
            
            console.log('Replace Response:', response2.data);
        }
        
    } catch (error) {
        console.error('Error testing tarif mitra:', error.response?.data || error.message);
    }
}

// Main test function
async function runAllTests() {
    console.log('🚀 Starting API Tests for Tarif with Confirmation...');
    
    try {
        await testTarifCustomerConfirmation();
        await testTarifEurekaConfirmation();
        await testTarifMitraConfirmation();
        
        console.log('\n✅ All tests completed!');
    } catch (error) {
        console.error('❌ Test execution failed:', error.message);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests();
}

module.exports = {
    testTarifCustomerConfirmation,
    testTarifEurekaConfirmation,
    testTarifMitraConfirmation,
    runAllTests
};
