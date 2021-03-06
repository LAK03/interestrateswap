// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 4712003    
    },
   production: {
   network_id: 42,
   host: '34.213.252.82', //aws instance ip
   port: 8000,
   gas: 4712003
  }
  }
}
