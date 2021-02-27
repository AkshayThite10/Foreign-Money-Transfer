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
    uint256 public rupee_to_OurCoin_conversionRate = 100;

    //how many OurCoin is there in the sender's wallet
    mapping(address => uint256) walletBalance;

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
                1
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

    function getPendingTransactions()
        public
        view
        returns (Transaction[] memory)
    {
        //   Transaction[] memory pendingTransactions=new Transaction[](transactions.length+1);

        //   uint index=0;
        //   for(uint i=0;i<transactions.length;i++)
        //   {
        //       if(transactions[i].timeStamp>timeStampAfterWhichTransactionsArePending)
        //       {
        //           pendingTransactions[index]=transactions[i];
        //           index=index+1;
        //       }
        //   }
        //using in arguments: uint256 timeStampAfterWhichTransactionsArePending
        return transactions;
    }

    function getBalance() public view returns (uint256) {
        return walletBalance[msg.sender];
    }
}
