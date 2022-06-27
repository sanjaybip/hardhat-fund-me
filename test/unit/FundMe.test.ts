import { deployments, network, ethers, getNamedAccounts } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { developmentChains } from "../../helper-hardhat-config";
import { FundMe, MockV3Aggregator } from "../../typechain-types";

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe: FundMe;
          let depolyer: SignerWithAddress;
          let mockV3Aggregator: MockV3Aggregator;
          const sendValue = ethers.utils.parseEther("1");
          beforeEach(async () => {
              //deploy our FundeMe contract using hardhat-deploy package
              //depolyer = (await getNamedAccounts()).depolyer;
              const accounts = await ethers.getSigners();
              depolyer = accounts[0];
              await deployments.fixture(["all"]); //this line depoly all deploy scripts tagged with "all"
              fundMe = await ethers.getContract("FundMe", depolyer);
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  depolyer
              );
          });

          describe("Constructor", function () {
              it("Set the aggregator addressess correctly", async () => {
                  const response = await fundMe.getPriceFeed();
                  assert.equal(response, mockV3Aggregator.address);
              });
          });

          describe("Fund", function () {
              it("Fails if you don't send enought ETH", async () => {
                  await expect(fundMe.Fund()).to.be.revertedWith(
                      "ETH is not enough!"
                  );
              });

              it("Update the amount funded data structure", async () => {
                  await fundMe.Fund({ value: sendValue });
                  const response = await fundMe.getAddressToAmountFunded(
                      depolyer.address
                  );
                  assert.equal(response.toString(), sendValue.toString());
              });

              it("Adds funder to funder arrays", async () => {
                  await fundMe.Fund({ value: sendValue });
                  const response = await fundMe.getFunders(0);
                  assert.equal(response, depolyer.address);
              });
          });

          describe("withdraw", async function () {
              beforeEach(async () => {
                  await fundMe.Fund({ value: sendValue });
              });
              it("withdarwas ETH from single funders", async () => {
                  //arrange
                  const startingFundmeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(depolyer.address);
                  //act
                  const transactionResop = await fundMe.withdraw();
                  const transactionReceipt = await transactionResop.wait(1);

                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundmeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(depolyer.address);
                  //assert
                  assert.equal(endingFundmeBalance.toString(), "0");
                  assert.equal(
                      startingFundmeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );
              });

              it("Allow to withdraw when multiple funders funded the contracts", async () => {
                  //Arrange
                  const accounts = await ethers.getSigners();
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContracts = await fundMe.connect(
                          accounts[i]
                      );
                      await fundMeConnectedContracts.Fund({ value: sendValue });
                  }

                  const startingFundmeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(depolyer.address);

                  //Act
                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait();

                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const withdrawGasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundmeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(depolyer.address);

                  //Assert
                  assert.equal(endingFundmeBalance.toString(), "0");
                  assert.equal(
                      startingFundmeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(withdrawGasCost).toString()
                  );
                  //Make funders array reset properly
                  await expect(fundMe.getFunders(0)).to.be.reverted;

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          (
                              await fundMe.getAddressToAmountFunded(
                                  accounts[i].address
                              )
                          ).toString(),
                          "0"
                      );
                  }
              });

              it("Only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners();
                  const connectAttackerToContract = await fundMe.connect(
                      accounts[1]
                  );

                  await expect(
                      connectAttackerToContract.withdraw()
                  ).to.be.revertedWith("FundMe__NotOwner");
              });

              it("Cheaper withdraw testing when multiple funders funded the contracts", async () => {
                  //Arrange
                  const accounts = await ethers.getSigners();
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContracts = await fundMe.connect(
                          accounts[i]
                      );
                      await fundMeConnectedContracts.Fund({ value: sendValue });
                  }

                  const startingFundmeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(depolyer.address);

                  //Act
                  const transactionResponse = await fundMe.cheaperWithdraw();
                  const transactionReceipt = await transactionResponse.wait();

                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const withdrawGasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundmeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(depolyer.address);

                  //Assert
                  assert.equal(endingFundmeBalance.toString(), "0");
                  assert.equal(
                      startingFundmeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(withdrawGasCost).toString()
                  );
                  //Make funders array reset properly
                  await expect(fundMe.getFunders(0)).to.be.reverted;

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          (
                              await fundMe.getAddressToAmountFunded(
                                  accounts[i].address
                              )
                          ).toString(),
                          "0"
                      );
                  }
              });
          });
      });
