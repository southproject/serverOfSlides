/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('refresh_token', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    client_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    token: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    created_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now
    }
  }, {
    tableName: 'refresh_token',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
