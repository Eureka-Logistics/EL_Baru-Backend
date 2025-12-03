// const margonoService = require('../../services/gpsApiMargonoServices');

// const nomorPlatList = [
//   "B 9586 TEU",
//   "B 9107 BEV",
//   "B 9642 BEU",
//   "B 9689 BEU",
//   "B 9114 BEV",
//   "B 9008 BEV",
//   "B 9103 BEV",
//   "B 9961 BEU",
//   "B 9959 BEU",
//   "N 9038 UF",
//   "N 9047 UF",
//   "B 9581 TEU",
//   "B 9956 BEU",
//   "B 9322 BEV",
//   "B 9288 BXU",
//   "B 9110 BEV",
//   "B 9002 BEV",
//   "B 9645 BEU",
//   "B 9997 BEU",
//   "B 9105 BEV",
//   "B 9007 BEV",
//   "B 9984 BEU",
//   "B 9112 BEV",
//   "B 9587 BEU",
//   "B 9408 BEV",
//   "B 9409 BEV",
//   "B 9410 BEV",
//   "B 9411 BEV",
//   "B 9412 BEV",
//   "B 9506 BEV",
//   "B 9507 BEV",
//   "B 9508 BEV",
//   "B 9509 BEV",
//   "B 9510 BEV",
//   "B 9010 BEV",
//   "B 9814 BRV",
//   "B 9011 BEV",
//   "B 9006 BEV",
//   "N 9382 UF",
//   "N 9379 UF",
//   "N 9050 UG",
//   "B 9989 BEU",
//   "B 9644 BEU"
// ];

// async function lastPosition(req, res) {
//    try {
//     const results = [];

//     for (const plateNo of nomorPlatList) {
//       try {
//         const data = await margonoService.lastPositionMargono(plateNo);
//         results.push({
//           plateNo,
//           data
//         });
//       } catch (err) {
//         results.push({
//           plateNo,
//           error: true,
//           message: err.message
//         });
//       }
//     }

//     res.status(200).json({
//       success: true,
//       status: 200,
//       total: results.length,
//       data: results
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       status: 500,
//       message: 'Failed to fetch all login data',
//       error: error.message
//     });
//   }
// }

// // async function getHistory(req, res) {
// //   try {
// //     const { plateNo, from, to } = req.query;
// //     const result = await margonoService.getHistoryLocation(plateNo, from, to);
// //     res.json(result);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Failed to fetch history location', error: error.message });
// //   }
// // }

// async function getHistory(req, res) {
//   try {
//     const { plateNo, from, to } = req.query;
//     const result = await margonoService.getHistoryLocation(plateNo, from, to);

//     const formattedData = result.Data.map(item => ({
//       datetime: item.Time,
//       mileage: Math.round(item.Miles / 1000),
//       heading: item.Angle,
//       speed: item.Velocity,
//       longitude: item.Longitude,
//       latitude: item.Latitude,
//       acc: item.Locate,
//       event_message: item.Alarm?.toString() || "",
//       fuel1_volume: item.Oil,
//       fuel2_volume: item.LevelNum,
//       temperature: item.Temperature,
//       geoName: ""
//     }));

//     res.status(200).json({
//       success: true,
//       status: 200,
//       data: formattedData
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       status: 500,
//       message: 'Failed to fetch history location',
//       error: error.message
//     });
//   }
// }

// module.exports = {
//   lastPosition,
//   getHistory
// };
