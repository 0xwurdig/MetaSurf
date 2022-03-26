import { Framework } from "@superfluid-finance/sdk-core";

import { ethers } from "ethers";


//where the Superfluid logic takes place
export default async function deleteFlow(sender, recipient) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const sf = await Framework.create({
    networkName: "Mumbai",
    provider: provider
  });



    const MATICx = "0x96B82B65ACF7072eFEb00502F45757F254c2a0D4";
    

  try {
    const deleteFlowOperation = sf.cfaV1.deleteFlow({
      sender: sender,
      receiver: recipient,
      superToken: MATICx
      
    });

    console.log("Deleting your stream...");

    await deleteFlowOperation.exec(signer);

    console.log(
      `Congrats - you've just deleted your money stream!
       Network: Kovan
       Super Token: DAIx
       Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
       Receiver: ${recipient}
    `
    );
  } catch (error) {
    console.error(error);
  }
}
