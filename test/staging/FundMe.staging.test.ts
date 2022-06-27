import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert } from "chai";
import { ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { FundMe } from "../../typechain-types";

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function () {
          let fundMe: FundMe;
          let deployer: SignerWithAddress;

          const sendValue = ethers.utils.parseEther("0.1");

          this.beforeEach(async () => {
              const accounts = await ethers.getSigners();
              deployer = accounts[0];
              //here we will omit deploying. Becasue staging test is done on testnet which means it is already deployed.
              //await deployments.fixture(["all"]);
              fundMe = await ethers.getContract("FundMe", deployer.address);
          });

          it("Allows people to fund and withdraw", async () => {
              await fundMe.Fund({ value: sendValue });
              await fundMe.withdraw({ gasLimit: 100000 });

              const endingFundmeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );
              console.log(
                  endingFundmeBalance.toString() +
                      " should equal 0, running assert equal..."
              );
              assert.equal(endingFundmeBalance.toString(), "0");
          });
      });
