module.exports = (sequelize, DataTypes) => {
    const locations = sequelize.define('locations', {
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },        
          location: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          address: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          city: {
              type: DataTypes.STRING,
              allowNull: false,
          },
          state: {
              type: DataTypes.STRING,
              allowNull: false,
          },        
          zipcode: {
              type: DataTypes.STRING,
              allowNull: false,
          },          
          country: {
              type: DataTypes.STRING,
              allowNull: false,
          },
          geom: {
            type: DataTypes.GEOMETRY('POINT',4326),
            allowNull: true,
          },
          latitude: {
            type: DataTypes.FLOAT,
            allowNull: false
          },
          longitude: {
            type: DataTypes.FLOAT,
            allowNull: false
          },
          createdAt: {
            field: 'created_at',
            allowNull: false,
            type: DataTypes.DATE
          },
          updatedAt: {
            field: 'updated_at',
            allowNull: false,
            type: DataTypes.DATE
          }
    });
    return locations;
  };
  