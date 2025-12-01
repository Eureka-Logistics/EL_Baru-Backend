const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_sm_retur_detail', {
    id_msm_retur_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_msm_retur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nama_barang: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    berat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    koli: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nilai_barang: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_sm_retur_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_msm_retur_detail" },
        ]
      },
    ]
  });
};
