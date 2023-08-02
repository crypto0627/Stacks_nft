import {
    makeContractCall,
    deserializeCV,
    AnchorMode,
    standardPrincipalCV,
    uintCV,
    someCV,
    PostConditionMode,
    contractPrincipalCV,
    broadcastTransaction,
  } from "@stacks/transactions";
  import { StacksTestnet, HIRO_MOCKNET_DEFAULT } from "@stacks/network";
  import 'dotenv/config'
  
  async function main() {
    const network = new StacksTestnet({ url: HIRO_MOCKNET_DEFAULT });
    const subnetUrl = process.env.SUBNET_URL;
    const senderKey = process.env.ALT_USER_KEY;
    const addr = process.env.ALT_USER_ADDR;
    const l1ContractAddr = process.env.DEPLOYER_ADDR;
    const l2ContractAddr = process.env.USER_ADDR;
    const withdrawalBlockHeight = process.argv[2];
    const nonce = parseInt(process.argv[3]);
    const withdrawalId = 0;
  
    let json_merkle_entry = await fetch(
      `${subnetUrl}/v2/withdrawal/nft/${withdrawalBlockHeight}/${addr}/${withdrawalId}/${l2ContractAddr}/simple-nft-l2/5`
    ).then((x) => x.json());
    let cv_merkle_entry = {
      withdrawal_leaf_hash: deserializeCV(json_merkle_entry.withdrawal_leaf_hash),
      withdrawal_root: deserializeCV(json_merkle_entry.withdrawal_root),
      sibling_hashes: deserializeCV(json_merkle_entry.sibling_hashes),
    };
  
    const txOptions = {
      senderKey,
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "subnet-v3-0-1",
      functionName: "withdraw-nft-asset",
      functionArgs: [
        contractPrincipalCV(l1ContractAddr, "simple-nft-l1"), // nft-contract
        uintCV(5), // ID
        standardPrincipalCV(addr), // recipient
        uintCV(withdrawalId), // withdrawal ID
        uintCV(withdrawalBlockHeight), // withdrawal block height
        someCV(contractPrincipalCV(l1ContractAddr, "simple-nft-l1")), // nft-mint-contract
        cv_merkle_entry.withdrawal_root, // withdrawal root
        cv_merkle_entry.withdrawal_leaf_hash, // withdrawal leaf hash
        cv_merkle_entry.sibling_hashes,
      ], // sibling hashes
      fee: 10000,
      postConditionMode: PostConditionMode.Allow,
      nonce,
    };
  
    const transaction = await makeContractCall(txOptions);
  
    const txid = await broadcastTransaction(transaction, network);
  
    console.log(txid);
  }
  
  main();