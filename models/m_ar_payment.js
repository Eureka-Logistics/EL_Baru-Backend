const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ar_payment', {
    id_payment: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_payment: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    no_reff: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    cabang: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    bank: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    tgl_transfer: {
      type: DataTypes.DATE,
      allowNull: false
    },
    no_kwitansi: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    keterangan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_ar_payment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_payment" },
        ]
      },
    ]
  });
};
