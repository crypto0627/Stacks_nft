import {
    AnchorMode,
    makeContractDeploy,
    broadcastTransaction,
  } from "@stacks/transactions";
  import { StacksTestnet, HIRO_MOCKNET_DEFAULT } from "@stacks/network";
  import { readFileSync } from "fs";
  import 'dotenv/config'
  
  async function main() {
    const contractName = process.argv[2];
    const contractFilename = process.argv[3];
    const networkLayer = parseInt(process.argv[4]);
    const nonce = parseInt(process.argv[5]);
    const senderKey = process.env.USER_KEY;
    let network = null;
    if (networkLayer == 1) {
      network = new StacksTestnet({ url: HIRO_MOCKNET_DEFAULT });
    } else if (networkLayer == 2) {
      network = new StacksTestnet({ url: process.env.SUBNET_URL });
      network.chainId = process.env.SUBNET_CHAIN_ID;
    } else {
      console.log(`Invalid networkLayer: ${networkLayer}`);
      return 1;
    }
  
    const codeBody = readFileSync(contractFilename, { encoding: "utf-8" });
  
    const transaction = await makeContractDeploy({
      codeBody,
      contractName,
      senderKey,
      network,
      anchorMode: AnchorMode.Any,
      fee: 10000,
      nonce,
    });
  
    const txid = await broadcastTransaction(transaction, network);
  
    console.log(txid);
  }
  
  main();