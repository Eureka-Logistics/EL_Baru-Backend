const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_pengajuan_biaya', {
    id_pb: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pengajuan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "dana"
    },
    keterangan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    dpp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gross_nominal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ppn: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ppn_nominal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pph: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    pph_nominal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_real: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bukti_biaya: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status_pb: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    catatan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tgl_insert_bukti: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tgl_acc_bukti: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_pengajuan_biaya',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pb" },
        ]
      },
    ]
  });
};
