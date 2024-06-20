// server/utils/ipUtils.js

const os = require('os');

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

// Function to convert IPv6-mapped IPv4 address to IPv4 format
const convertIPv6ToIPv4 = (ipv6Address) => {
  const match = ipv6Address.match(/^::ffff:(\d+.\d+.\d+.\d+)$/);
  if (match) {
    return match[1]; // Return IPv4 address
  } else {
    return ipv6Address; // Return original address if not IPv6-mapped IPv4
  }
};

module.exports = { getLocalIP, convertIPv6ToIPv4 };