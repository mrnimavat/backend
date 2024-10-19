"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.STRING(70),
        defaultValue: Sequelize.UUIDV4,
      },
      first_name: {
        type: Sequelize.STRING(30),
      },
      last_name: {
        type: Sequelize.STRING(30),
      },
      email: {
        type: Sequelize.STRING(300),
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      user_role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user_role",
          key: "id",
        },
      },
      token: {
        type: Sequelize.STRING,
      },
      expiration_time: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
