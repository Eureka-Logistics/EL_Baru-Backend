const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_sm_kondisi_barang', {
    id_msm_kondisi: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_msm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    salahkirim: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rusak: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kurang: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dipisah: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_admin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    salahkirim_satuan: {
      type: DataTypes.ENUM('qty','kg','koli','ikat'),
      allowNull: false
    },
    rusak_satuan: {
      type: DataTypes.ENUM('qty','kg','koli','ikat'),
      allowNull: false
    },
    kurang_satuan: {
      type: DataTypes.ENUM('qty','kg','koli','ikat'),
      allowNull: false
    },
    dipisah_satuan: {
      type: DataTypes.ENUM('qty','kg','koli','ikat'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_sm_kondisi_barang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_msm_kondisi" },
        ]
      },
    ]
  });
};
