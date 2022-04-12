module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    ropsten:{
      provider : function() {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`},providerOrUrl:`https://ropsten.infura.io/v3/${process.env.INFURA_ID}`})},
      network_id:3,
    },
    kovan:{
      provider : function() {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`},providerOrUrl:`https://kovan.infura.io/v3/${process.env.INFURA_ID}`})},
      network_id:42,
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.13",
    }
  },

  plugins : ["solidity-coverage"]
}
