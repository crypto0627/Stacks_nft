import {
    makeContractCall,
    AnchorMode,
    standardPrincipalCV,
    uintCV,
    PostConditionMode,
    broadcastTransaction,
  } from "@stacks/transactions";
  import { StacksTestnet } from "@stacks/network";
  import 'dotenv/config'
  
  async function main() {
    let network = new StacksTestnet({ url: process.env.SUBNET_URL });
    network.chainId = process.env.SUBNET_CHAIN_ID;
    const senderKey = process.env.USER_KEY;
    const addr = process.env.USER_ADDR;
    const alt_addr = process.env.ALT_USER_ADDR;
    const nonce = parseInt(process.argv[2]);
  
    const txOptions = {
      contractAddress: addr,
      contractName: "simple-nft-l2",
      functionName: "transfer",
      functionArgs: [
        uintCV(5), // ID
        standardPrincipalCV(addr), // sender
        standardPrincipalCV(alt_addr), // recipient
      ],
      senderKey,
      validateWithAbi: false,
      network,
      anchorMode: AnchorMode.Any,
      fee: 10000,
      nonce,
      postConditionMode: PostConditionMode.Allow,
    };
  
    const transaction = await makeContractCall(txOptions);
  
    const txid = await broadcastTransaction(transaction, network);
  
    console.log(txid);
  }
  
  main();