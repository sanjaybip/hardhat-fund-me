# FundMe Smart Contract Using Hardhart

This is  demonstrations of simple smart contract written on Solidity programming language. This code is written while following the free course on Solidity by Patrick Collions.

This project is developed with `hardhat` framework using `TypeScript`. This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

## FundMe
All the smart contracts are written inside `/contracts` folder. The FundMe smart contract allow the contract owner to collect fund from different funders. It also allow to withdraw fund by the owner or deployer.

I have used chainlink to get the ETH price so that funders sent at least minimum amount of ETH. 

All the test code is in `/test` folder. Deploy scripts are inside the `/deploy` folder.

## Network
We have tested the code in `localhost` and `hardhat` local network. For testnet we have used `rinkeby`. Make sure you have some ETH in your testnet network. You can get free testnet ETH on major testnet network by chainlink website. 

## Running the code
To run and test the code in your local development machine copy the repo with following command. We have used `yarn` package manager. You can use `NPM`.
```shell
git clone https://github.com/sanjaydefidev/hardhat-fund-me
```
Installing all the dependencies
```shell
yarn install
```
## Shell commands
To comile the solidity.
```shell
yarn hardhat compile
```

To deploy on testnet.
```shell
yarn hardhat deploy --network rinkeby
```

To run the mocha tests.
```shell
yarn hardhat test
```
To run the coverage of code.
```shell
yarn hardhat coverage
```
For futher detail of this tutorial [check this link](https://github.com/PatrickAlphaC/hardhat-fund-me-fcc).

## Note
Thank you @PatrickAlphaC for creating such and awesome tutorial.
