const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('uang_jalan_periode', {
    id_uang_jalan_periode: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_surat_uj: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    periode_ke: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kode_periode: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    tgl_mulai: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tgl_akhir: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    saldo_awal: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    cadangan: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    total_nominal: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tgl_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ptj: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ptj_realisasi: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    tgl_ptj: {
      type: DataTypes.DATE,
      allowNull: true
    },
    jurnal_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jurnal_transaction_no: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    jurnal_custom_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'uang_jalan_periode',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_uang_jalan_periode" },
        ]
      },
      {
        name: "id_user",
        using: "BTREE",
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
};
