const axios = require('axios');
const NodeCache = require('node-cache');
const tokenCache = new NodeCache({ stdTTL: 3600 });

const API_BASE = process.env.GPS_API_BASE;
const ACCOUNT_NAME = process.env.GPS_ACCOUNT_NAME;
const ACCOUNT_PASSWORD = process.env.GPS_ACCOUNT_PASSWORD;

const BASE_URL = process.env.MARGONO_BASE_URL;
const USERNAME = process.env.MARGONO_USERNAME;
const PASSWORD = process.env.MARGONO_PASSWORD;

// =====================================> TOTAL KILAT
async function getToken() {
  let token = tokenCache.get('gpsToken');
  if (!token) {
    const res = await axios.get(`${API_BASE}/token`, {
      params: {
        grant_type: 'totalkilatgps',
        account_name: ACCOUNT_NAME,
        account_password: ACCOUNT_PASSWORD
      }
    });
    token = res.data.access_token;
    tokenCache.set('gpsToken', token);
  }
  return token;
}

async function fetchDeviceInfo() {
  const token = await getToken();
  const res = await axios.get(`${API_BASE}/deviceInfo`, {
    params: { grant_type: 'totalkilatgps', access_token: token }
  });
  return res.data;
}

async function fetchDeviceHistoryData(deviceName, startTime, endTime) {
  const token = await getToken();
  const res = await axios.get(`${API_BASE}/deviceHistoryData`, {
    params: {
      grant_type: 'totalkilatgps',
      access_token: token,
      device_name: deviceName,
      start_time: startTime,
      end_time: endTime
    }
  });
  return res.data;
}

async function fetchLatestVehiclePosition() {
  const token = await getToken();
  const res = await axios.get(`${API_BASE}/latestVehiclePosition`, {
    params: {
      grant_type: 'totalkilatgps',
      access_token: token
    }
  });
  return res.data;
}

// =====================================> MARGONO
async function lastPositionMargono(plateNo) {
  const url = `${BASE_URL}/login.aspx`;
  const params = {
    UserName: USERNAME,
    Pwd: PASSWORD,
    VehNof: plateNo
  };

  const res = await axios.get(url, { params });
  return res.data;
}

async function getHistoryLocation(plateNo, from, to) {
  const url = `${BASE_URL}/api/gethistorylocation.aspx`;
  const params = {
    UserName: USERNAME,
    Password: PASSWORD,
    PlateNo: plateNo,
    From: from,
    To: to
  };

  const res = await axios.get(url, { params });
  return res.data;
}

module.exports = {
  fetchDeviceInfo,
  fetchDeviceHistoryData,
  fetchLatestVehiclePosition,
  lastPositionMargono,
  getHistoryLocation
};
