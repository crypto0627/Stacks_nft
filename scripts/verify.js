import { uintCV, callReadOnlyFunction, cvToString } from "@stacks/transactions";
import { StacksTestnet, HIRO_MOCKNET_DEFAULT } from "@stacks/network";
import 'dotenv/config'

async function main() {
  const networkLayer = parseInt(process.argv[2]);
  const senderAddress = process.env.ALT_USER_ADDR;
  let contractAddress = null;
  let contractName = null;
  let network = null;

  if (networkLayer == 1) {
    contractName = "simple-nft-l1";
    contractAddress = process.env.DEPLOYER_ADDR;
    network = new StacksTestnet({ url: HIRO_MOCKNET_DEFAULT });
  } else if (networkLayer == 2) {
    contractName = "simple-nft-l2";
    contractAddress = process.env.USER_ADDR;
    network = new StacksTestnet({ url: process.env.SUBNET_URL });
    network.chainId = process.env.SUBNET_CHAIN_ID;
  } else {
    console.log(`Invalid networkLayer: ${networkLayer}`);
    return 1;
  }

  const txOptions = {
    contractAddress,
    contractName,
    functionName: "get-owner",
    functionArgs: [uintCV(5)],
    network,
    senderAddress,
  };

  const result = await callReadOnlyFunction(txOptions);

  console.log(cvToString(result.value));
}

main();