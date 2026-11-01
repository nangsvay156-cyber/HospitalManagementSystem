require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // In development this keeps the schema in sync with the models.
    // For production, use proper migrations instead of sync({ alter: true }).
    await sequelize.sync({ alter: true });
    console.log('Models synced.');

    app.listen(PORT, () => {
      console.log(`HMS API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
