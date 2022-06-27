import { ethers, getNamedAccounts } from "hardhat";

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    console.log(`Got contract FundMe at ${fundMe.address}`);
    console.log(`Funding Contract...`);
    const transactionResponse = await fundMe.Fund({
        value: ethers.utils.parseEther("0.5"),
    });
    await transactionResponse.wait();
    console.log(`Funded`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
