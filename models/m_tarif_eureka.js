const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_tarif_eureka', {
    id_tarif_eureka: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_tarif_eureka: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    id_muat_kota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tujuan_kota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_kendaraan_jenis: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    service_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    via: {
      type: DataTypes.ENUM('darat','laut','udara'),
      allowNull: false
    },
    jenis_kiriman: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    ritase: {
      type: DataTypes.DECIMAL(1,1),
      allowNull: false
    },
    uang_jalan: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    maintenance_cost: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    variable_cost: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    fixed_cost: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    percent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tarif: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nett_price: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false
    },
    max_tonase: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    harga_selanjutnya: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    satuan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_bu: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_tarif_eureka',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_tarif_eureka" },
        ]
      },
    ]
  });
};
