
const initModels = require('../../models/init-models');
const db = require('../../models');
const models = initModels(db.sequelize);

// Mendapatkan data kendaraanstatus berdasarkan id_kendaraan
exports.getKendaraanStatusByIdKendaraan = async (req, res) => {
  const { id_kendaraan } = req.params;
  try {
    const data = await models.kendaraanstatus.findOne({
      where: { id_kendaraan },
      include: [
        {
          model: models.kendaraan,
          required: true
        }
      ]
    });
    if (!data) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error });
  }
};
