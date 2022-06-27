interface networkBase {
  ethUsdPriceFeed?: string;
  blockConfirmation?: number;
}

interface newtorkConfigItem {
  [key: string]: networkBase;
}
export const networkConfig: newtorkConfigItem = {
  localhost: {},
  hardhat: {},
  kovan: {
    ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    blockConfirmation: 6,
  },
  rinkeby: {
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    blockConfirmation: 6,
  },
};
export const developmentChains = ["localhost", "hardhat"];
