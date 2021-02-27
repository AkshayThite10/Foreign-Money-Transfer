
window.onload = function() {
    if (typeof web3 !== 'undefined') {
        web3Provider = web3.currentProvider;
    } else {
        // If no injected web3 instance is detected, fall back to Ganache
        web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(web3Provider);
    console.log(web3);
    console.log('Getting development accounts');
    accounts = web3.eth.accounts;
    organizer_account = accounts[0];
    buyer_account = accounts[1];
    console.log('Organizer account: ', organizer_account);
    console.log('Buyer account: ', buyer_account)
    console.log('Initializing Event Tickets DApp')


};