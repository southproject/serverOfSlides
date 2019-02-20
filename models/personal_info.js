/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('personal_info', {
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
    nick_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    position: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sexy: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'personal_info',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
