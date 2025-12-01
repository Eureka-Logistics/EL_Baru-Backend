// const axios = require('axios');
// require('dotenv').config();

// const BASE_URL = process.env.MARGONO_BASE_URL;
// const USERNAME = process.env.MARGONO_USERNAME;
// const PASSWORD = process.env.MARGONO_PASSWORD;

// async function lastPositionMargono(plateNo) {
//   const url = `${BASE_URL}/login.aspx`;
//   const params = {
//     UserName: USERNAME,
//     Pwd: PASSWORD,
//     VehNof: plateNo
//   };

//   const res = await axios.get(url, { params });
//   return res.data;
// }

// async function getHistoryLocation(plateNo, from, to) {
//   const url = `${BASE_URL}/api/gethistorylocation.aspx`;
//   const params = {
//     UserName: USERNAME,
//     Password: PASSWORD,
//     PlateNo: plateNo,
//     From: from,
//     To: to
//   };

//   const res = await axios.get(url, { params });
//   return res.data;
// }

// module.exports = {
//   lastPositionMargono,
//   getHistoryLocation
// };
