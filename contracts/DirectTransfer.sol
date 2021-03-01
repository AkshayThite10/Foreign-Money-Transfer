pragma solidity >=0.4;

pragma experimental ABIEncoderV2;

contract DirectTransfer {
    struct Transaction {
        address senderBankAddress;
        address receiverBankAddress;
        string senderUser;
        string receiverUser;
        uint256 amount;
        uint256 timeStamp;
    }

    Transaction[] transactions;
   
    address owner; //who ever is starting the transaction is the owner

    // Introducing the Rupee to OurCoin conversion rate
    uint256 public rupee_to_OurCoin_conversionRate = 1;

    //how many OurCoin is there in the sender's wallet
    mapping(address => uint256) walletBalance;
    mapping(address=>uint) lastTimestamp;

    function sendToForeignBank(
        address senderBankAddress,
        address receiverBankAddress,
        string memory senderUser,
        string memory receiverUser,
        uint256 amount
    ) public {
        /* Add the amount to the user's balance, call the event associated with a deposit,
       then return the balance of the user */
        Transaction memory transaction =
            Transaction(
                senderBankAddress,
                receiverBankAddress,
                senderUser,
                receiverUser,
                amount,
                block.timestamp
            ); 
        transactions.push(transaction);
        walletBalance[msg.sender] -= amount;
        walletBalance[receiverBankAddress] += amount;
    }

    function addRupeeToWallet(uint256 rupeeToPutInWallet) public {
        uint256 OurCoin_bought =
            rupeeToPutInWallet * rupee_to_OurCoin_conversionRate;
        walletBalance[msg.sender] += OurCoin_bought;
    }

    function debitFromWallet(uint256 rupeeToTakeOutOfWallet) public {
        uint256 OurCoins =
            rupeeToTakeOutOfWallet / rupee_to_OurCoin_conversionRate;
        require(walletBalance[msg.sender] >= OurCoins);
        walletBalance[msg.sender] -= OurCoins;
        //send the money from this wallet to this particular bank with sendUser and receiverUser info
    }

     function getTransactionLength() public view  returns (uint)
    {
        // setPendingTransactions();   
        return transactions.length;

    }

    function getTransactionByIndex(uint index) public view returns(address,address,string memory,string memory,uint,uint)
    {
        Transaction memory t=transactions[index];
            return (t.senderBankAddress,t.receiverBankAddress,t.senderUser,t.receiverUser,t.amount,t.timeStamp);
    }

    function getLastPendingTransactionTimestamp(address adrs) public view returns(uint)
    {
        return lastTimestamp[adrs];
    }

    function setLastPendingTransactionTimestamp(address adrs,uint timestampToSet) public 
    {
        lastTimestamp[adrs]=timestampToSet;
    }
    // function setPendingTransactions ()  public
    // {
    //       uint timeStampAfterWhichTransactionsArePending=lastTimestamp[msg.sender];
    //       pendingTransactions=new Transaction[](transactions.length);

    //       uint index=0;
    //       for(uint i=0;i<transactions.length;i++)
    //       {
    //           if(transactions[i].receiverBankAddress!=msg.sender) continue;

    //           if(transactions[i].timeStamp>timeStampAfterWhichTransactionsArePending)
    //           {
    //               pendingTransactions[index]=transactions[i];
    //               index=index+1;
    //           }
    //       }

    //       pendingTransactionsLength=index;
    //     //using in arguments: uint256 timeStampAfterWhichTransactionsArePending
         
    // }




    function getBalance() public view returns (uint256) {
        return walletBalance[msg.sender];
    }
}

// gett length from transaction
// 3
// 0
