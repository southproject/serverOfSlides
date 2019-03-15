/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('knowledge', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      descript: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      field:{
          type:DataTypes.STRING(50),
          allowNull:true
      },
      subject:{
        type:DataTypes.STRING(255),
        allowNull:true
      }
    }, {
      tableName: 'knowledge',
      timestamps:false,
      paranoid:true,
      underscored:false,
      version:false
    });
  };
  