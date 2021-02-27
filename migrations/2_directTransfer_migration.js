const DirectTransfer=artifacts.require("DirectTransfer");

module.exports = function (deployer) {
  
  deployer.deploy(DirectTransfer);

};