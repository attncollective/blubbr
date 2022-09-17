import { useState } from "react";
import Web3Modal from "web3modal";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

//where the Superfluid logic takes place
async function createNewFlow(recipient, flowRate) {
  // web3Modal example
  const web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions: {}
  });
  const web3ModalRawProvider = await web3Modal.connect();
  const web3ModalProvider = new ethers.providers.Web3Provider(web3ModalRawProvider);
  const sf = await Framework.create({
    chainId: process.env.SF_CHAINID, //your chainId here
    provider: web3ModalProvider
  });
  const signer = sf.createSigner({ web3Provider: web3ModalProvider });

  const SuperTokenContract = await sf.loadSuperToken(process.env.SF_SUPERTOKEN);
  const superToken = SuperTokenContract.address;

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      flowRate: flowRate,
      receiver: recipient,
      superToken: superToken
    });

    console.log("Creating your stream...");

    const result = await createFlowOperation.exec(signer);
    console.log(result);

    console.log(
      `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
    Super Token: ${superToken},
    Sender: ${process.env.SF_SENDER_ADDRESS}
    Receiver: ${recipient},
    FlowRate: ${flowRate}
    `
    );
    return result;
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
    return error;
  }
}

export default function Supertoken () {
  
    const handleSubmit = async (event) => {
      // Stop the form from submitting and refreshing the page.
      event.preventDefault()
      const recipient = event.target.recipient.value;  
      const flowRate = event.target.flowrate.value;
      const response = await createNewFlow(recipient, flowRate)
      console.log(response)
    };
  
    return (
      <div className="mt-24 ml-24 md:ml-64 xl:ml-80 mb-16">
      <form onSubmit={handleSubmit}>
        <div class="mb-6">
          <label for="label" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Create a Flow</label>
        </div>
        <div class="mb-6">
          <label for="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">ETH address</label>
          <input class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="ETH address of Receiver" required="" id="recipient" name="recipient"/>
        </div>
        <div class="mb-6">
        <select id="token" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option>fDAIx</option>
        </select>
        </div>
        <div class="mb-6">
          <label for="flowrate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Flowrate</label>
          <input class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Flowrate in Wei/sec" required="" id="flowrate" name="flowrate"/>
        </div>
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create stream</button>
        </form>
          </div>
    );
  };
  