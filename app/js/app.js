var myConferenceInstance;
var defaultAccount;
 

window.onload = function() {
    web3Provider=null;
    if (typeof web3 !== 'undefined') {
        web3Provider = window.ethereum;   //metamask
        window.ethereum.enable();  // very important line
    } else {
        // If no injected web3 instance is detected, fall back to Ganache
        web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(web3Provider);
    // console.log("web3provider",web3Provider);
    // console.log('Getting development accounts');
    accounts = web3.eth.accounts;
    web3.eth.defaultAccount = web3.eth.accounts[0]
    defaultAccount=web3.eth.accounts[0];
    
    
    //  console.log('Initializing Event Tickets DApp');
   
    initializeConference();


};

async function initializeConference() {
    $.getJSON('http://127.0.0.1:5500/build/contracts/DirectTransfer.json', function(data) {
    var DirectTransferArtifact = data;
    DirectTransfer = TruffleContract(DirectTransferArtifact);

    // Set the provider for our contract.
    DirectTransfer.setProvider(web3Provider);
    // console.log('Here');
    // console.log('Event Tickets', DirectTransfer);
    DirectTransfer.deployed().then(
    function(instance) {
        // console.log('Event Tickets contract instance', instance);
        myConferenceInstance = instance;   
        $("#currentAddress").html(defaultAccount); 
        // $("#act").html(myConferenceInstance.address);
        // console.log('The contract address', instance.address);
        // debitFromWallet(1000);
        // sendToForeignBank(defaultAccount,receiverBankAddress,s1,s2,amount);
        // addRupeeToWallet(1);
        // getBalance();
         
    }).catch(
        function(err) {
            console.log('Contract is not deployed???');
            console.log(err);
    });
    });

    
}

async function getBalance()
{
    
     initializeConference();
    // const balance=await myConferenceInstance.getBalance();
    // 
    // console.log(balance);
    // // console.log("balance", balance.c[0]);
    
    setTimeout(()=>{
        myConferenceInstance.getBalance().then(
            e=> $("#balance").html(e.c[0])
    )
    },1000
    );
    
    // console.log(myConferenceInstance.getBalance());
}

function addRupeeToWallet(arg)
{
     const rupeeToAddInWallet=parseInt(arg);
     if(!Number.isInteger(rupeeToAddInWallet)) {
         alert('Please input valid number');
         return;
     }
    myConferenceInstance.addRupeeToWallet(rupeeToAddInWallet).then(getBalance(),()=>console.log("Failed request.."));
}

async function debitFromWallet(arg)
{
    const rupeeToDebitFromWallet=parseInt(arg);
     if(!Number.isInteger(rupeeToDebitFromWallet)) {
         alert('Please input valid number');
         return;
     }
     const bl=await getBalance();
     if(bl<rupeeToDebitFromWallet){
        alert('Your balance is low');
        return;
     }  
    myConferenceInstance.debitFromWallet(rupeeToDebitFromWallet).then(getBalance());
} 

async function sendToForeignBank()
{
     
    const receiverBankAddress=$("#receiverBankAddress")[0].value;
    const senderUser=$("#senderUser")[0].value;
    const receiverUser=$("#receiverUser")[0].value;
    const amount=parseInt($("#amount")[0].value);

    if(!(receiverBankAddress && senderUser && receiverUser && amount ))
    {
        
        alert("Please input the required fields correctly.");
        return;
    }

    // console.log(receiverBankAddress,senderUser,receiverUser,amount);

    const bl=await getBalance();
     if(bl<amount){
        alert('Your balance is low');
        return;
     }  

     // defaultAccount,receiverBankAddress,s1,s2,amount
    myConferenceInstance.sendToForeignBank(defaultAccount,receiverBankAddress,senderUser,receiverUser,amount).then(
        getBalance()
    );
}

function getPendingTransactions()
{
    
}
