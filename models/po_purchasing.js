const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('po_purchasing', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pu: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    no_po: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    no_sm: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    jenis_armada: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    via: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_alm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_alb: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    berat: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    overtonase: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    kubik: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    qty: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    tipe: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    harga: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    biayakg: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    biaya_lain: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    biayamd: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    biayaot: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    top: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "Y"
    },
    tgl_buat: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'po_purchasing',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
