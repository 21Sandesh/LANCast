const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/', (req, res) => {
    const { dbName, dbUser, dbPassword, dbHost } = req.body;

    // Construct .env file content
    const envContent = `
DB_NAME=${dbName}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_HOST=${dbHost}
DB_PORT=3306
  `;

    // Write to .env file
    fs.writeFileSync(path.join(__dirname, '..', '..', '.env'), envContent);

    res.sendStatus(200);
});

module.exports = router;
