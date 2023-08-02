import {
    makeContractCall,
    AnchorMode,
    standardPrincipalCV,
    uintCV,
    PostConditionMode,
    broadcastTransaction,
  } from "@stacks/transactions";
  import { StacksTestnet, HIRO_MOCKNET_DEFAULT } from "@stacks/network";
  import 'dotenv/config'


  async function main() {
    
    const network = new StacksTestnet({ url: HIRO_MOCKNET_DEFAULT });
    const nonce = 0;
  
    let txOptions = {
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "subnet-v3-0-1",
      functionName: "deposit-stx",
      functionArgs: [
        uintCV(5000000), // amount
        standardPrincipalCV(process.env.USER_ADDR), // sender
      ],
      senderKey: process.env.USER_KEY,
      validateWithAbi: false,
      network,
      anchorMode: AnchorMode.Any,
      fee: 10000,
      postConditionMode: PostConditionMode.Allow,
      nonce,
    };
  
    let transaction = await makeContractCall(txOptions);
  
    let txid = await broadcastTransaction(transaction, network);
  
    console.log(txid);
  
    txOptions = {
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "subnet-v3-0-1",
      functionName: "deposit-stx",
      functionArgs: [
        uintCV(5000000), // amount
        standardPrincipalCV(process.env.ALT_USER_ADDR), // sender
      ],
      senderKey: process.env.ALT_USER_KEY,
      validateWithAbi: false,
      network,
      anchorMode: AnchorMode.Any,
      fee: 10000,
      postConditionMode: PostConditionMode.Allow,
      nonce,
    };
  
    transaction = await makeContractCall(txOptions);
  
    txid = await broadcastTransaction(transaction, network);
  
    console.log(txid);
  }
  
  main();