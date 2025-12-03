const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ap_personal', {
    id_ap: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_invoice_ap: {
      type: DataTypes.STRING(22),
      allowNull: false
    },
    mitra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mitra_inv: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    faktur_pajak: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    tgl_invoice_ap: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tgl_terima: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    top: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ppn: {
      type: DataTypes.DECIMAL(3,1),
      allowNull: false,
      defaultValue: 0.0
    },
    pph: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    charge: {
      type: DataTypes.DOUBLE(6,2),
      allowNull: false,
      defaultValue: 0.00
    },
    nilai_charge: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    diskon: {
      type: DataTypes.DOUBLE(6,2),
      allowNull: true,
      defaultValue: 0.00
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tgl_create: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status_upload: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_ap_personal',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ap" },
        ]
      },
    ]
  });
};
