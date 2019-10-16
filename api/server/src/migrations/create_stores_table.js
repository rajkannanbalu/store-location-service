module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('locations', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },        
        location: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false,
        },        
        zipcode: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        geom: {
            type: Sequelize.GEOMETRY('POINT', 4326),
            allowNull: true
        },
        latitude: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        longitude: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        country: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        createdat: {
          field: 'created_at',
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedat: {
          field: 'updated_at',
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    },
    down: (queryInterface) => {
      return queryInterface.dropTable('locations');
    }
  };
  