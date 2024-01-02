"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var anchor_1 = require("@project-serum/anchor");
var mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
var baseMpl_1 = require("./base/baseMpl");
var baseSpl_1 = require("./base/baseSpl");
var mintingConfig_1 = require("./mintingConfig");
var bytes_1 = require("@project-serum/anchor/dist/cjs/utils/bytes");
var log = console.log;
var rpcUrl = mintingConfig_1.mintingConfig.isMain ? mintingConfig_1.mintingConfig.rpcUrlMain : mintingConfig_1.mintingConfig.rpcUrlDev;
var connection = new anchor_1.web3.Connection(rpcUrl);
var baseSpl = new baseSpl_1.BaseSpl(connection);
var baseMpl;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var payerKp, _payerKey, receiver, _wallet, provider, tokenKp, token, name, symbol, uri, createUsdcRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payerKp = null;
                    _payerKey = mintingConfig_1.mintingConfig.payer;
                    if (!_payerKey)
                        throw "Payer key not found";
                    if (typeof _payerKey == 'string')
                        payerKp = anchor_1.web3.Keypair.fromSecretKey(Uint8Array.from(bytes_1.bs58.decode(_payerKey)));
                    else
                        payerKp = anchor_1.web3.Keypair.fromSecretKey(Uint8Array.from(_payerKey));
                    if (!payerKp)
                        throw "Unable to parse payer key";
                    log({ payer: payerKp.publicKey.toBase58() });
                    receiver = mintingConfig_1.mintingConfig.nftReceiver ? new anchor_1.web3.PublicKey(mintingConfig_1.mintingConfig.nftReceiver) : payerKp.publicKey;
                    _wallet = new anchor_1.Wallet(payerKp);
                    provider = new anchor_1.AnchorProvider(connection, _wallet, {});
                    baseMpl = new baseMpl_1.BaseMpl(provider.wallet, { endpoint: connection.rpcEndpoint });
                    tokenKp = anchor_1.web3.Keypair.generate();
                    token = tokenKp.publicKey;
                    log({ token: token.toBase58() });
                    name = mintingConfig_1.mintingConfig.nftName;
                    symbol = mintingConfig_1.mintingConfig.nftSymbol;
                    uri = mintingConfig_1.mintingConfig.nftUri;
                    return [4 /*yield*/, baseMpl.__createToken({
                            mintTokens: false,
                            name: name,
                            symbol: symbol,
                            uri: uri,
                            sellerFeeBasisPoints: 0,
                            tokenStandard: mpl_token_metadata_1.TokenStandard.NonFungible,
                        }, { mintKeypair: tokenKp, mintAmount: 1, receiver: receiver, decimal: 0 })];
                case 1:
                    createUsdcRes = _a.sent();
                    log({ createUsdcRes: createUsdcRes });
                    return [2 /*return*/];
            }
        });
    });
}
main().then(function (_) {
    log("Success");
}).catch(function (error) {
    log({ error: error });
});
