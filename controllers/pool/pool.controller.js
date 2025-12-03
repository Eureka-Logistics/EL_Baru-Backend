const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');

exports.getAllPools = async (req, res) => {
  try {
    const pools = await models.m_pool.findAll({
      attributes: ['id_pool', 'nama_pool', 'alamat_pool', 'pool_code', 'latitude', 'longitude', 'status'],
      order: [['nama_pool', 'ASC']]
    });

    res.status(200).json({
      status: true,
      message: 'Berhasil mengambil data pool',
      total: pools.length,
      data: pools,
    });
  } catch (error) {
    console.error('Error getAllPools:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data pool',
      error: error.message,
    });
  }
};
