
import { Framework } from "@superfluid-finance/sdk-core";

import { ethers } from "ethers";


//where the Superfluid logic takes place
export default async function deleteFlow(sender, recipient) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const sf = await Framework.create({
    networkName: "kovan",
    provider: provider
  });

  // const signer = sf.createSigner({
  //   privateKey:
  //     "0xd2ebfb1517ee73c4bd3d209530a7e1c25352542843077109ae77a2c0213375f1",
  //   provider: customHttpProvider
  // });

  const DAIx = "0xe3cb950cb164a31c66e32c320a800d477019dcff";

  try {
    const deleteFlowOperation = sf.cfaV1.deleteFlow({
      sender: sender,
      receiver: recipient,
      superToken: DAIx
      // userData?: string
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