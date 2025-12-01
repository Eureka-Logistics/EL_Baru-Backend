const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_lelang', {
    id_lelang: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mpd: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'm_pengadaan_detail',
        key: 'id_mpd'
      }
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'mitra',
        key: 'id_mitra'
      }
    },
    status: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    confirm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    auction_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    auction_unloading: {
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
    tableName: 'm_lelang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_lelang" },
        ]
      },
      {
        name: "id_mitra",
        using: "BTREE",
        fields: [
          { name: "id_mitra" },
        ]
      },
      {
        name: "id_mpd",
        using: "BTREE",
        fields: [
          { name: "id_mpd" },
        ]
      },
    ]
  });
};
