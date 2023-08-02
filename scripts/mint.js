import {
    makeContractCall,
    AnchorMode,
    standardPrincipalCV,
    uintCV,
    broadcastTransaction,
  } from "@stacks/transactions";
  import { StacksTestnet, HIRO_MOCKNET_DEFAULT } from "@stacks/network";
  import 'dotenv/config'
  
  async function main() {
    const network = new StacksTestnet({ url: HIRO_MOCKNET_DEFAULT });
    const senderKey = process.env.USER_KEY;
    const deployerAddr = process.env.DEPLOYER_ADDR;
    const addr = process.env.USER_ADDR;
    const nonce = parseInt(process.argv[2]);
  
    const txOptions = {
      contractAddress: deployerAddr,
      contractName: "simple-nft-l1",
      functionName: "gift-nft",
      functionArgs: [standardPrincipalCV(addr), uintCV(5)],
      senderKey,
      validateWithAbi: false,
      network,
      anchorMode: AnchorMode.Any,
      fee: 10000,
      nonce,
    };
  
    const transaction = await makeContractCall(txOptions);
  
    const txid = await broadcastTransaction(transaction, network);
  
    console.log(txid);
  }
  
  main();