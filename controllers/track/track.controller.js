const core = require('../../config/core.config');
const models = core.models();
const { Op } = require('sequelize');
const moment = require('moment');
const gpsService = require('../../services/gpsApiServices');
const flatten = require('flat');

const m_sm = models.m_sm;
const kendaraanstatus = models.kendaraanstatus;
const kendaraan = models.kendaraan;
const m_pengadaan_detail = models.m_pengadaan_detail;
const m_pengadaan = models.m_pengadaan;
const alamat = models.alamat;
const kota = models.kota;

exports.getTrackingByResi = async (req, res) => {
  const { resi } = req.query;

  if (!resi) {
    return res.status(400).json({ message: "Resi tidak ditemukan" });
  }

  try {
    const kiriman = await m_sm.findOne({
      where: {
        msm: resi,
        is_deleted: 0
      },
      raw: true
    });

    if (!kiriman) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    const kendaraanStatusList = await kendaraanstatus.findAll({
      where: { id_msm: kiriman.id_msm },
      order: [['tgl_create', 'ASC']],
      raw: true
    });

    const idKendaraan = kendaraanStatusList[0]?.id_kendaraan;
    let kendaraanData = null;
    if (idKendaraan) {
        kendaraanData = await kendaraan.findOne({
            where: { id: idKendaraan },
            raw: true
        });
    }

    // Fetch address data from m_pengadaan_detail
    let addressData = {
      almuat: "-",
      kotamuat: "-", 
      latmuat: "-",
      lonmuat: "-",
      albongkar: "-",
      kotabongkar: "-",
      latbongkar: "-",
      lonbongkar: "-"
    };
    
    let mspData = "-";

    if (kiriman.id_mpd) {
      const pengadaanDetail = await m_pengadaan_detail.findOne({
        where: { id_mpd: kiriman.id_mpd },
        raw: true
      });

      if (pengadaanDetail) {
        // Fetch MSP data from m_pengadaan
        if (pengadaanDetail.id_mp) {
          const pengadaan = await m_pengadaan.findOne({
            where: { id_mp: pengadaanDetail.id_mp },
            raw: true
          });
          if (pengadaan) {
            mspData = pengadaan.msp || "-";
          }
        }

        // Fetch loading address data
        if (pengadaanDetail.id_almuat) {
          const alamatMuat = await alamat.findOne({
            where: { id: pengadaanDetail.id_almuat },
            raw: true
          });
          if (alamatMuat) {
            addressData.almuat = alamatMuat.alamat || "-";
            addressData.latmuat = alamatMuat.lat?.toString() || "-";
            addressData.lonmuat = alamatMuat.lon?.toString() || "-";
          }
        }

        // Fetch loading city data
        if (pengadaanDetail.id_kota_muat) {
          const kotaMuat = await kota.findOne({
            where: { id: pengadaanDetail.id_kota_muat },
            raw: true
          });
          if (kotaMuat) {
            addressData.kotamuat = kotaMuat.kota || "-";
          }
        }

        // Fallback: If kota_muat is still "-", try to get it from alamat table
        if (addressData.kotamuat === "-" && pengadaanDetail.id_almuat) {
          const alamatMuat = await alamat.findOne({
            where: { id: pengadaanDetail.id_almuat },
            raw: true
          });
          if (alamatMuat && alamatMuat.kota) {
            addressData.kotamuat = alamatMuat.kota;
          }
        }

        // Fetch unloading address data
        if (pengadaanDetail.id_albongkar) {
          const alamatBongkar = await alamat.findOne({
            where: { id: pengadaanDetail.id_albongkar },
            raw: true
          });
          if (alamatBongkar) {
            addressData.albongkar = alamatBongkar.alamat || "-";
            addressData.latbongkar = alamatBongkar.lat?.toString() || "-";
            addressData.lonbongkar = alamatBongkar.lon?.toString() || "-";
            
            // If kota_bongkar is still "-", try to get it from alamat table
            if (addressData.kotabongkar === "-" && alamatBongkar.kota) {
              addressData.kotabongkar = alamatBongkar.kota;
            }
          }
        }

        // Fetch unloading city data
        if (pengadaanDetail.id_kota_bongkar) {
          const kotaBongkar = await kota.findOne({
            where: { id: pengadaanDetail.id_kota_bongkar },
            raw: true
          });
          if (kotaBongkar) {
            addressData.kotabongkar = kotaBongkar.kota || "-";
          }
        }

        // Debug logging untuk kotamuat dan kotabongkar
        console.log("Debug kotamuat:", {
          id_kota_muat: pengadaanDetail.id_kota_muat,
          kotamuat: addressData.kotamuat
        });
        console.log("Debug kotabongkar:", {
          id_kota_bongkar: pengadaanDetail.id_kota_bongkar,
          kotabongkar: addressData.kotabongkar
        });
      }
    }

    // Get start_time and end_time from database
    let start_time, end_time;
    
    // Start time: Use tgl_muat from m_sm (loading date)
    if (kiriman.tgl_muat) {
      start_time = moment(kiriman.tgl_muat).format("YYYY-MM-DD HH:mm:ss");
    } else {
      start_time = moment().subtract(48, 'hours').format("YYYY-MM-DD HH:mm:ss");
    }
    
    // End time: Only show if status action is 9 (success), otherwise show "-"
    const selesaiStatus = kendaraanStatusList.find(ks => Number(ks.action) === 9);
    
    if (selesaiStatus && selesaiStatus.tgl_update) {
      // If status action is 9 (success), show the end time
      end_time = moment(selesaiStatus.tgl_update).format("YYYY-MM-DD HH:mm:ss");
    } else {
      // If status action is not 9 yet, show "-"
      end_time = "-";
    }

    let trackingData = [[]];
    if (kendaraanData?.gps_device_id) {
    try {
        const trackingRaw = await gpsService.fetchDeviceHistoryData(
        kendaraanData.gps_device_id,
        start_time,
        end_time
        );

        if (
        Array.isArray(trackingRaw) &&                  
        trackingRaw.length > 0 &&
        typeof trackingRaw[0] === 'object' &&           
        !Array.isArray(trackingRaw[0])                 
        ) {
        trackingData = [trackingRaw];
        } else if (
        Array.isArray(trackingRaw) &&                  
        Array.isArray(trackingRaw[0])
        ) {
        trackingData = trackingRaw;
        }

    } catch (err) {
        console.error("Gagal ambil tracking:", err.message);
    }
    }



    const result = {
      message: "Berhasil mendapatkan data",
      start_time: start_time,
      end_time: end_time,
      device_name: kendaraanData?.gps_device_id || "",
      kiriman: {
        id_msm: kiriman.id_msm.toString(),
        id_bu: kiriman.id_bu?.toString() || "",
        msm: kiriman.msm,
        tgl_muat: kiriman.tgl_muat ? moment(kiriman.tgl_muat).format("YYYY-MM-DD") : "",
        berat: kiriman.berat?.toString() || "0",
        qty: kiriman.qty?.toString() || "0",
        koli: kiriman.koli?.toString() || "0",
        ikat: kiriman.ikat?.toString() || "0",
        do: kiriman.do || "",
        msp: mspData,
        service: "retailer",
        tgl_order: kiriman.tgl_muat ? moment(kiriman.tgl_muat).format("YYYY-MM-DD HH:mm:ss") : "",
        gps_type: kendaraanData?.gps_type || "",
        gps_device_id: kendaraanData?.gps_device_id || "",
        no_polisi: kiriman.nopol || "",
        jenis_kendaraan: kendaraanData?.jenis_kendaraan || "",
        nama: kiriman.supir || "",
        almuat: addressData.almuat,
        kotamuat: addressData.kotamuat,
        latmuat: addressData.latmuat,
        lonmuat: addressData.lonmuat,
        albongkar: addressData.albongkar,
        kotabongkar: addressData.kotabongkar,
        latbongkar: addressData.latbongkar,
        lonbongkar: addressData.lonbongkar
      },
      kendaraanstatus: kendaraanStatusList.map((item) => ({
        id: item.id.toString(),
        id_kendaraan: item.id_kendaraan.toString(),
        no_polisi: item.no_polisi || "",
        id_pengemudi: item.id_pengemudi.toString(),
        nama_driver: item.nama_driver || "",
        id_msm: item.id_msm.toString(),
        kondisi_kendaraan: item.kondisi_kendaraan,
        action: item.action.toString(),
        empty_load: item.empty_load || "",
        keterangan: item.keterangan,
        memo: item.memo,
        customer: item.customer,
        posisi: item.posisi,
        longitude: item.longitude || "",
        latitude: item.latitude || "",
        tujuan: item.tujuan,
        foto: item.foto,
        tgl_update: item.tgl_update ? moment(item.tgl_update).format("YYYY-MM-DD HH:mm:ss") : "-",
        id_user: item.id_user.toString(),
        tgl_create: item.tgl_create ? moment(item.tgl_create).format("YYYY-MM-DD HH:mm:ss") : "-"
      })),
      tracking: trackingData
    };

    return res.json(result);

  } catch (error) {
    console.error("Tracking error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
