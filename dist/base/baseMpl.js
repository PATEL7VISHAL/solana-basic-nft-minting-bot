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
exports.BaseMpl = void 0;
var anchor_1 = require("@project-serum/anchor");
var bytes_1 = require("@project-serum/anchor/dist/cjs/utils/bytes");
// import { WalletContextState } from "@solana/wallet-adapter-react";
var baseSpl_1 = require("./baseSpl");
// import { Uses } from "@metaplex-foundation/js/node_modules/@metaplex-foundation/mpl-token-metadata";
var mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
var js_1 = require("@metaplex-foundation/js");
var log = console.log;
var BaseMpl = /** @class */ (function () {
    function BaseMpl(wallet, web3Config) {
        var _this = this;
        this.mplIxs = [];
        this.mplSigns = [];
        this.setUpCallBack = function (ixs, signs) {
            var _a, _b;
            if (ixs) {
                (_a = _this.mplIxs).push.apply(_a, ixs);
                log("ixs added to mpl : ", ixs);
            }
            if (signs) {
                log("sings added to mpl : ", signs);
                (_b = _this.mplSigns).push.apply(_b, signs);
            }
        };
        this.connection = new anchor_1.web3.Connection(web3Config.endpoint, { commitment: 'confirmed' });
        this.metaplex = new js_1.Metaplex(this.connection);
        this.provider = new anchor_1.AnchorProvider(this.connection, wallet, { commitment: 'confirmed' });
        if (this.metaplex.identity().publicKey.toBase58() != wallet.publicKey.toBase58()) {
            this.metaplex.identity().setDriver({
                publicKey: wallet.publicKey,
                signMessage: null, //PERF: 
                signTransaction: wallet.signTransaction,
                signAllTransactions: wallet.signAllTransactions,
            });
        }
    }
    BaseMpl.prototype.reinit = function () {
        // const user = this.wallet.publicKey;
        // if (this.metaplex.identity().publicKey.toBase58() != user.toBase58()) {
        //   this.metaplex.identity().setDriver({
        //     publicKey: user,
        //     signMessage: this.wallet.signMessage,
        //     signTransaction: this.wallet.signTransaction,
        //     signAllTransactions: this.wallet.signAllTransactions,
        //   });
        // }
        //
        // this.mplIxs = [];
    };
    BaseMpl.getEditionAccount = function (tokenId) {
        return anchor_1.web3.PublicKey.findProgramAddressSync([
            bytes_1.utf8.encode("metadata"),
            mpl_token_metadata_1.PROGRAM_ID.toBuffer(),
            tokenId.toBuffer(),
            bytes_1.utf8.encode("edition"),
        ], mpl_token_metadata_1.PROGRAM_ID)[0];
    };
    BaseMpl.getMetadataAccount = function (tokenId) {
        return anchor_1.web3.PublicKey.findProgramAddressSync([bytes_1.utf8.encode("metadata"), mpl_token_metadata_1.PROGRAM_ID.toBuffer(), tokenId.toBuffer()], mpl_token_metadata_1.PROGRAM_ID)[0];
    };
    BaseMpl.getCollectionAuthorityRecordAccount = function (collection, authority) {
        return anchor_1.web3.PublicKey.findProgramAddressSync([
            bytes_1.utf8.encode("metadata"),
            mpl_token_metadata_1.PROGRAM_ID.toBuffer(),
            collection.toBuffer(),
            bytes_1.utf8.encode("collection_authority"),
            authority.toBuffer()
        ], mpl_token_metadata_1.PROGRAM_ID)[0];
    };
    BaseMpl.prototype.__createToken = function (input, opts) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var ixs, user, baseSpl, decimal, mintAmount, mintKeypair, _b, mintIxs, _mintKeypair, mint, txBuilder, setMetadataIxs, tx, res;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        ixs = [];
                        user = (_a = this === null || this === void 0 ? void 0 : this.provider) === null || _a === void 0 ? void 0 : _a.publicKey;
                        baseSpl = new baseSpl_1.BaseSpl(this.connection);
                        decimal = opts.decimal, mintAmount = opts.mintAmount, mintKeypair = opts.mintKeypair;
                        decimal = decimal !== null && decimal !== void 0 ? decimal : 0;
                        mintKeypair = mintKeypair !== null && mintKeypair !== void 0 ? mintKeypair : anchor_1.web3.Keypair.generate();
                        if (typeof opts.receiver == 'string')
                            opts.receiver = new anchor_1.web3.PublicKey(opts.receiver);
                        return [4 /*yield*/, baseSpl.__getCreateTokenInstructions({
                                decimal: decimal,
                                mintAuthority: user,
                                minting: {
                                    tokenAmount: mintAmount,
                                    receiver: opts.receiver
                                },
                                mintKeypair: mintKeypair
                            })];
                    case 1:
                        _b = _d.sent(), mintIxs = _b.ixs, _mintKeypair = _b.mintKeypair;
                        ixs.push.apply(ixs, mintIxs);
                        input.useNewMint = mintKeypair;
                        input.mintTokens = false;
                        mint = mintKeypair.publicKey;
                        return [4 /*yield*/, this.metaplex.nfts().builders().create(input)];
                    case 2:
                        txBuilder = _d.sent();
                        return [4 /*yield*/, txBuilder.getInstructions()];
                    case 3:
                        setMetadataIxs = _d.sent();
                        ixs.push.apply(ixs, setMetadataIxs);
                        tx = (_c = new anchor_1.web3.Transaction()).add.apply(_c, ixs);
                        return [4 /*yield*/, this.provider.sendAndConfirm(tx, [mintKeypair])];
                    case 4:
                        res = _d.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    return BaseMpl;
}());
exports.BaseMpl = BaseMpl;
