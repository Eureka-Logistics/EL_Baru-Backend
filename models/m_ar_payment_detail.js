const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ar_payment_detail', {
    id_pd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_payment: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_ar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bayar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pph: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    beban: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    klaim: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    sisa_bayar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    no_kwitansi: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    tgl_insert: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_ar_payment_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pd" },
        ]
      },
    ]
  });
};
