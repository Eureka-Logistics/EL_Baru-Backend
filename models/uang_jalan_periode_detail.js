const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('uang_jalan_periode_detail', {
    id_periode_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_uang_jalan_periode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_kendaraan_jenis: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tujuan: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    jml_unit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    freq_kirim: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_perunit: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    biaya_jumlah: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'uang_jalan_periode_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_periode_detail" },
        ]
      },
    ]
  });
};
