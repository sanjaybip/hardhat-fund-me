import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const DECIMALS = 8;
const INITIAL_PRICE = 115000000000; // 1150

const deployMocks: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId!;
  // If we are on a local development network, we need to deploy mocks!

  if (chainId == 31337) {
    log("Local network detected! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      args: [DECIMALS, INITIAL_PRICE],
      log: true,
    });
    log("Mocks Deployed!");
    log("----------------------------------");
    log(
      "You are deploying to a local network, you'll need a local network running to interact"
    );
    log(
      "Please run `yarn hardhat console` to interact with the deployed smart contracts!"
    );
    log("----------------------------------");
  }
};
export default deployMocks;
deployMocks.tags = ["all", "mocks"];
