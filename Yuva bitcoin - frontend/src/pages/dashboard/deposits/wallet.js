import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || "https://mainnet.infura.io/v3/3840775933b94a0ca2cc13fa742a2b43");

export const BUSD_TESTNET_CONTRACT_ADDRESS = '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee';
export const BUSDabi = [
  {
    "constant": false, "inputs": [], "name": "disregardProposeOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": true, "inputs": [], "name": "assetProtectionRole", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "r", "type": "bytes32[]" }, { "name": "s", "type": "bytes32[]" }, { "name": "v", "type": "uint8[]" }, { "name": "to", "type": "address[]" }, { "name": "value", "type": "uint256[]" }, { "name": "fee", "type": "uint256[]" }, { "name": "seq", "type": "uint256[]" }, { "name": "deadline", "type": "uint256[]" }], "name": "betaDelegatedTransferBatch", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "sig", "type": "bytes" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }, { "name": "fee", "type": "uint256" }, { "name": "seq", "type": "uint256" }, { "name": "deadline", "type": "uint256" }], "name": "betaDelegatedTransfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": false, "inputs": [], "name": "initializeDomainSeparator", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": false, "inputs": [], "name": "unpause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "unfreeze", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": false, "inputs": [], "name": "claimOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_newSupplyController", "type": "address" }], "name": "setSupplyController", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": true, "inputs": [], "name": "paused", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": true, "inputs": [{ "name": "_addr", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": false, "inputs": [], "name": "initialize", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": false, "inputs": [], "name": "pause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": true, "inputs": [], "name": "getOwner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": true, "inputs": [{ "name": "target", "type": "address" }], "name": "nextSeqOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_newAssetProtectionRole", "type": "address" }], "name": "setAssetProtectionRole", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "freeze", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_newWhitelister", "type": "address" }], "name": "setBetaDelegateWhitelister", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "decreaseSupply", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": true, "inputs": [{ "name": "_addr", "type": "address" }], "name": "isWhitelistedBetaDelegate", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "whitelistBetaDelegate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_proposedOwner", "type": "address" }], "name": "proposeOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "increaseSupply", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": true, "inputs": [], "name": "betaDelegateWhitelister", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": true, "inputs": [], "name": "proposedOwner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "unwhitelistBetaDelegate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "wipeFrozenAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "constant": true, "inputs": [], "name": "EIP712_DOMAIN_HASH", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": true, "inputs": [{ "name": "_addr", "type": "address" }], "name": "isFrozen", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": true, "inputs": [], "name": "supplyController", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function"
  }, {
    "constant": false, "inputs": [], "name": "reclaimBUSD", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
  }, {
    "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"
  }, {

    "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event"
  }, {

    "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event"
  }, {
    "anonymous": false, "inputs": [{ "indexed": true, "name": "currentOwner", "type": "address" }, { "indexed": true, "name": "proposedOwner", "type": "address" }], "name": "OwnershipTransferProposed", "type": "event"
  }, {
    "anonymous": false, "inputs": [{ "indexed": true, "name": "oldProposedOwner", "type": "address" }], "name": "OwnershipTransferDisregarded", "type": "event"
  }, {
    "anonymous": false, "inputs": [{ "indexed": true, "name": "oldOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event"
  }, {
    "anonymous": false, "inputs": [], "name": "Pause", "type": "event"
  }, {
    "anonymous": false, "inputs": [], "name": "Unpause", "type": "event"
  }, {
    "anonymous": false, "inputs": [{ "indexed": true, "name": "addr", "type": "address" }], "name": "AddressFrozen", "type": "event"
  }, {
    "anonymous": false, "inputs": [{ "indexed": true, "name": "addr", "type": "address" }], "name": "AddressUnfrozen", "type": "event"
  }, {
    "anonymous": false, "inputs": [{ "indexed": true, "name": "addr", "type": "address" }], "name": "FrozenAddressWiped", "type": "event"
  }, {
    "anonymous": false, "inputs": [{ "indexed": true, "name": "oldAssetProtectionRole", "type": "address" }, { "indexed": true, "name": "newAssetProtectionRole", "type": "address" }], "name": "AssetProtectionRoleSet", "type": "event"
  }, {
    "anonymous": false, "inputs": [{ "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "SupplyIncreased", "type": "event"
  }, {
    "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "SupplyDecreased", "type": "event"
  }, {
    "anonymous": false, "inputs": [{ "indexed": true, "name": "oldSupplyController", "type": "address" }, { "indexed": true, "name": "newSupplyController", "type": "address" }], "name": "SupplyControllerSet", "type": "event"
  }, {
    "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }, { "indexed": false, "name": "seq", "type": "uint256" }, { "indexed": false, "name": "fee", "type": "uint256" }], "name": "BetaDelegatedTransfer", "type": "event"
  }, {
    "anonymous": false, "inputs": [{ "indexed": true, "name": "oldWhitelister", "type": "address" }, { "indexed": true, "name": "newWhitelister", "type": "address" }], "name": "BetaDelegateWhitelisterSet", "type": "event"
  }, {

    "anonymous": false, "inputs": [{ "indexed": true, "name": "newDelegate", "type": "address" }], "name": "BetaDelegateWhitelisted", "type": "event"
  }, {

    "anonymous": false, "inputs": [{ "indexed": true, "name": "oldDelegate", "type": "address" }], "name": "BetaDelegateUnwhitelisted", "type": "event"
  }
];
export const CONTRACT = new web3.eth.Contract(BUSDabi, BUSD_TESTNET_CONTRACT_ADDRESS);



// export const YUVABITCOIN_ABI = 