import { ethers, getNamedAccounts } from "hardhat";

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    console.log(`Got contract FundMe at ${fundMe.address}`);
    console.log(`Withdrawing fund...`);
    const transactionResponse = await fundMe.withdraw();
    await transactionResponse.wait();
    console.log(`Fund is withdrawn succesfully!`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
