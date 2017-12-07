var TradingAccount = artifacts.require("./TradingAccount.sol");
var RateProvider = artifacts.require("./RateProvider.sol");
var InterestRateSwap = artifacts.require("./InterestRateSwap.sol");


module.exports = function(deployer) {
  deployer.deploy(TradingAccount);
  deployer.deploy(RateProvider);
  deployer.deploy(InterestRateSwap);
};
