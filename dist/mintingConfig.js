"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintingConfig = void 0;
exports.mintingConfig = {
    isMain: false, //NOTE: false means on devnet and true means on mainnet
    collectionId: "",
    payer: [159, 197, 126, 182, 182, 81, 217, 136, 84, 11, 128, 196, 74, 118, 127, 49, 171, 25, 21, 178, 106, 51, 189, 162, 142, 2, 175, 38, 38, 38, 39, 139, 125, 21, 60, 27, 225, 70, 89, 79, 161, 27, 106, 6, 39, 20, 223, 65, 57, 111, 18, 120, 8, 83, 87, 153, 113, 161, 5, 136, 248, 189, 205, 189],
    nftReceiver: "",
    // payer: "", //NOTE: this might be a string as well
    // NFT INFO:
    nftName: "Test23",
    nftSymbol: "T23",
    nftUri: "Unknown",
    rpcUrlDev: "https://api.devnet.solana.com", //NOTE: for devnet
    rpcUrlMain: "https://api.mainnet-beta.solana.com", //NOTE: mainnet
};