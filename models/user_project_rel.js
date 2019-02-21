/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_project_rel', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    project_id: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    hoster: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'user_project_rel',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
