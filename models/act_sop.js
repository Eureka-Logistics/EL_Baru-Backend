const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('act_sop', {
    id_act_sop: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_surat: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    judul: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    no_revisi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    akses: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    id_bu: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tgl_created: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'act_sop',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_act_sop" },
        ]
      },
    ]
  });
};
