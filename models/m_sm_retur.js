const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_sm_retur', {
    id_msm_retur: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_msm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    no_retur: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_unit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_retur: {
      type: DataTypes.DATE,
      allowNull: true
    },
    stage: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    kategori: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    foto: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    penerima: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    alasan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_pool: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_admin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pihak_dibebankan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    memo_accounting: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_sm_retur',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_msm_retur" },
        ]
      },
    ]
  });
};
