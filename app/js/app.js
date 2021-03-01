 

var myConferenceInstance;
var defaultAccount;
let lastPendingTransactionTimestamp;
let pendingTransaction=[];
let finalPendingTransactions=[];
 

window.onload =  function() {
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
         myConferenceInstance.getLastPendingTransactionTimestamp(defaultAccount).then((e)=>{lastPendingTransactionTimestamp=e.c[0]; });

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

async function getPendingTransactions()
{
    let lengthOfTransactionArray=await myConferenceInstance.getTransactionLength();
    let pt=[];
    while(lengthOfTransactionArray>0)
    {
        lengthOfTransactionArray--;
            pt.push(await myConferenceInstance.getTransactionByIndex(lengthOfTransactionArray));
        
    }
    
    filterOurPendingTransaction(pt);
    
}

function filterOurPendingTransaction(pt)
{
    
    const currentAddress=defaultAccount;
    const len=pt.length;



    for(let i=0;i<len;i++)
    {
        // console.log(pt[i]);
        if(pt[i][1]!=currentAddress || pt[i][5].c[0]<lastPendingTransactionTimestamp) continue;

        finalPendingTransactions.push(pt[i]);  //new pending transaction
        
         
    }

    displayPendingTransactions();
 
}
//have pending transactions on the ui and make a button to update the timestamp and remove the soled trnsactions from the ui
function displayPendingTransactions()
{
    const mainDiv=document.getElementById("pendingTransactions");

    const len=finalPendingTransactions.length;
    const parentDiv=document.createElement("div");
        parentDiv.setAttribute("identifyBy","box");

        if(mainDiv.hasChildNodes())
            mainDiv.removeChild(parentDiv);

    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
    }

    for(let i=0;i<len;i++)
    {
        var timestamp=finalPendingTransactions[i][5];
                if(timestamp.c[0]<=parseInt(lastPendingTransactionTimestamp)) continue;
        var div=document.createElement("div");
                div.className="pendingTransactions ";
                div.setAttribute("index",i);
                
                var senderBankAddress=finalPendingTransactions[i][0];
                div.setAttribute("id",timestamp);
                var receiverBankAddress=finalPendingTransactions[i][1];
                var senderUser=finalPendingTransactions[i][2];
                var receiverUser=finalPendingTransactions[i][3];
                var amount=finalPendingTransactions[i][4];
                
                div.setAttribute("timestamp",timestamp);
                let p=document.createElement("p");
                    p.innerHTML="Sender Bank: "+senderBankAddress+
                                "</br>Amount received: "+amount;
                    var btn=document.createElement("button");
                            btn.textContent="Complete"
                            btn.setAttribute("onclick","deleteThisTransaction(this)");
                            btn.className=" btn btn-outline-danger";
                            btn.setAttribute("id",timestamp);
            div.appendChild(p); 
            div.appendChild(btn);
            parentDiv.appendChild(div);
           
    }
    
    mainDiv.appendChild(parentDiv);
    
    

}


function deleteThisTransaction(arg)
{
    let senderBankAddress=arg.id;
    var el=document.getElementById(senderBankAddress);
    // console.log(el)
    var prnt=el.parentElement;
    lastPendingTransactionTimestamp=el.getAttribute("timestamp");
    console.log(lastPendingTransactionTimestamp);
    myConferenceInstance.setLastPendingTransactionTimestamp(defaultAccount,parseInt(lastPendingTransactionTimestamp)).then(console.log("successfully update the timestamp"));
    prnt.removeChild(el);
    finalPendingTransactions.splice(prnt.tabIndex,1);   
    
}