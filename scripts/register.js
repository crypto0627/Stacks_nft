import {
    makeContractCall,
    AnchorMode,
    contractPrincipalCV,
    broadcastTransaction,
    getNonce,
  } from "@stacks/transactions";
  import { StacksTestnet, HIRO_MOCKNET_DEFAULT } from "@stacks/network";
  import 'dotenv/config'
  
  async function main() {
    const network = new StacksTestnet({ url: HIRO_MOCKNET_DEFAULT });
    const senderKey = process.env.DEPLOYER_KEY;
    const deployerAddr = process.env.DEPLOYER_ADDR;
    const userAddr = process.env.USER_ADDR;
    const nonce = (await getNonce(deployerAddr, network)) + BigInt(1);
  
    const txOptions = {
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "subnet-v3-0-1",
      functionName: "register-new-nft-contract",
      functionArgs: [
        contractPrincipalCV(deployerAddr, "simple-nft-l1"),
        contractPrincipalCV(userAddr, "simple-nft-l2"),
      ],
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