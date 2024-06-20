const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function setup() {
    try {
        // Dynamically import fetch from node-fetch
        const { default: fetch } = await import('node-fetch');

        const getLocalIP = () => {
            const ifaces = os.networkInterfaces();
            let localIP = 'localhost';

            Object.keys(ifaces).forEach((ifname) => {
                ifaces[ifname].forEach((iface) => {
                    if (iface.family === 'IPv4' && !iface.internal) {
                        localIP = iface.address;
                    }
                });
            });

            return localIP;
        };

        const updateEnvFile = (dbName, dbUser, dbPassword, dbHost) => {
            const envFilePath = path.join(__dirname, 'server', '.env');
            const envContent = `
DB_NAME=${dbName}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_HOST=${dbHost}
DB_PORT=3306
      `;

            fs.writeFileSync(envFilePath, envContent);
            console.log('.env file updated successfully');
        };

        const updateProxyConfig = async (localIP) => {
            const proxyConfig = `http://${localIP}:8800`;

            const packageJsonPath = path.join(__dirname, 'client', 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            packageJson.proxy = proxyConfig;

            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            console.log('Proxy configuration updated successfully:', proxyConfig);
        };

        const startServers = () => {
            // Start Node.js server
            const nodeProcess = exec('node server/app.js', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error starting Node.js server: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                console.log(`Node.js server started successfully:\n${stdout}`);
            });

            // Start React.js server
            const reactProcess = exec('npm start --prefix client', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error starting React.js server: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                console.log(`React.js server started successfully:\n${stdout}`);
            });

            // Optionally, you can handle events or other logic related to these processes here
        };

        const localIP = getLocalIP();
        console.log('Detected local IP:', localIP);

        // Replace placeholders with actual database credentials
        const dbName = 'your_database_name';
        const dbUser = 'your_database_user';
        const dbPassword = 'your_database_password';

        updateEnvFile(dbName, dbUser, dbPassword, localIP);
        await updateProxyConfig(localIP);
        startServers();
    } catch (error) {
        console.error('Setup failed:', error);
    }
}

setup();
