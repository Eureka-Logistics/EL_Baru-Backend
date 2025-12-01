const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_operasional_uang_jalan', {
    id_uang_jalan: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bayar_dari: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    no_transaksi: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    penerima: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tgl_transaksi: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_ppn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_pph: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_nominal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_datetime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_operasional_uang_jalan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_uang_jalan" },
        ]
      },
    ]
  });
};
