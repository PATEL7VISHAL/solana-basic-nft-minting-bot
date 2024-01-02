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
exports.BaseSpl = exports.calcDecimalValue = exports.calcNonDecimalValue = void 0;
var spl_token_1 = require("@solana/spl-token");
var anchor_1 = require("@project-serum/anchor");
var log = console.log;
function calcNonDecimalValue(value, decimals) {
    return Math.trunc(value * (Math.pow(10, decimals)));
}
exports.calcNonDecimalValue = calcNonDecimalValue;
function calcDecimalValue(value, decimals) {
    return value / (Math.pow(10, decimals));
}
exports.calcDecimalValue = calcDecimalValue;
var BaseSpl = /** @class */ (function () {
    function BaseSpl(connection) {
        this.__splIxs = [];
        this.__connection = connection;
        this.__cacheAta = new Set();
    }
    BaseSpl.prototype.__reinit = function () {
        this.__splIxs = [];
        this.__cacheAta = new Set();
    };
    BaseSpl.prototype.__getCreateTokenInstructions = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var decimal, mintAuthority, freezAuthority, payer, minting, mintKeypair, mint, rent, ix1, ix2, tokenAmount, receiver, _a, ata, createTokenAccountIx, ix3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.__reinit();
                        decimal = opts.decimal, mintAuthority = opts.mintAuthority, freezAuthority = opts.freezAuthority, payer = opts.payer, minting = opts.minting, mintKeypair = opts.mintKeypair;
                        payer = payer !== null && payer !== void 0 ? payer : mintAuthority;
                        freezAuthority = freezAuthority !== null && freezAuthority !== void 0 ? freezAuthority : mintAuthority;
                        decimal = decimal !== null && decimal !== void 0 ? decimal : 0;
                        mintKeypair = mintKeypair !== null && mintKeypair !== void 0 ? mintKeypair : anchor_1.web3.Keypair.generate();
                        mint = mintKeypair.publicKey;
                        return [4 /*yield*/, this.__connection.getMinimumBalanceForRentExemption(spl_token_1.MINT_SIZE)];
                    case 1:
                        rent = _b.sent();
                        ix1 = anchor_1.web3.SystemProgram.createAccount({
                            fromPubkey: payer,
                            lamports: rent,
                            newAccountPubkey: mintKeypair.publicKey,
                            programId: spl_token_1.TOKEN_PROGRAM_ID,
                            space: spl_token_1.MINT_SIZE,
                        });
                        this.__splIxs.push(ix1);
                        ix2 = (0, spl_token_1.createInitializeMintInstruction)(mintKeypair.publicKey, decimal, mintAuthority, freezAuthority);
                        this.__splIxs.push(ix2);
                        if (minting) {
                            tokenAmount = minting.tokenAmount, receiver = minting.receiver;
                            receiver = receiver !== null && receiver !== void 0 ? receiver : mintAuthority;
                            tokenAmount = tokenAmount !== null && tokenAmount !== void 0 ? tokenAmount : 1;
                            tokenAmount = (Math.pow(10, decimal)) * tokenAmount;
                            _a = this.__getCreateTokenAccountInstruction(mint, receiver), ata = _a.ata, createTokenAccountIx = _a.ix;
                            this.__splIxs.push(createTokenAccountIx);
                            ix3 = (0, spl_token_1.createMintToInstruction)(mint, ata, mintAuthority, tokenAmount);
                            this.__splIxs.push(ix3);
                        }
                        return [2 /*return*/, {
                                mintKeypair: mintKeypair,
                                ixs: this.__splIxs,
                            }];
                }
            });
        });
    };
    BaseSpl.prototype.__getCreateTokenAccountInstruction = function (mint, owner, allowOffCurveOwner, payer) {
        if (allowOffCurveOwner === void 0) { allowOffCurveOwner = false; }
        var ata = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, owner, allowOffCurveOwner);
        var ix = (0, spl_token_1.createAssociatedTokenAccountInstruction)(payer !== null && payer !== void 0 ? payer : owner, ata, owner, mint);
        return {
            ata: ata,
            ix: ix,
        };
    };
    BaseSpl.prototype.__getOrCreateTokenAccountInstruction = function (input, ixCallBack) {
        return __awaiter(this, void 0, void 0, function () {
            var owner, mint, payer, allowOffCurveOwner, checkCache, ata, ix, info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        owner = input.owner, mint = input.mint, payer = input.payer, allowOffCurveOwner = input.allowOffCurveOwner, checkCache = input.checkCache;
                        allowOffCurveOwner = allowOffCurveOwner !== null && allowOffCurveOwner !== void 0 ? allowOffCurveOwner : false;
                        payer = payer !== null && payer !== void 0 ? payer : owner;
                        ata = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, owner, allowOffCurveOwner);
                        ix = null;
                        return [4 /*yield*/, this.__connection.getAccountInfo(ata)];
                    case 1:
                        info = _a.sent();
                        if (!info) {
                            ix = (0, spl_token_1.createAssociatedTokenAccountInstruction)(payer !== null && payer !== void 0 ? payer : owner, ata, owner, mint);
                            if (ixCallBack) {
                                if (checkCache) {
                                    if (!this.__cacheAta.has(ata.toBase58())) {
                                        ixCallBack([ix]);
                                        this.__cacheAta.add(ata.toBase58());
                                    }
                                    else
                                        log("ata init already exist");
                                }
                                else {
                                    ixCallBack([ix]);
                                }
                            }
                        }
                        return [2 /*return*/, {
                                ata: ata,
                                ix: ix,
                            }];
                }
            });
        });
    };
    BaseSpl.prototype._getTransferInstructions = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var mint, sender, receiver, _amount, receiverIsOffCurve, ixs, mintInfo, decimal, amount, _a, senderAta, ix1, _b, receiverAta, ix2, ix;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        mint = input.mint, sender = input.sender, receiver = input.receiver, _amount = input.amount, receiverIsOffCurve = input.receiverIsOffCurve;
                        receiverIsOffCurve = receiverIsOffCurve !== null && receiverIsOffCurve !== void 0 ? receiverIsOffCurve : false;
                        if (typeof mint == 'string')
                            mint = new anchor_1.web3.PublicKey(mint);
                        if (typeof sender == 'string')
                            sender = new anchor_1.web3.PublicKey(sender);
                        if (typeof receiver == 'string')
                            receiver = new anchor_1.web3.PublicKey(receiver);
                        ixs = [];
                        return [4 /*yield*/, (0, spl_token_1.getMint)(this.__connection, mint)];
                    case 1:
                        mintInfo = _c.sent();
                        decimal = mintInfo.decimals;
                        amount = calcNonDecimalValue(_amount, decimal);
                        return [4 /*yield*/, this.__getOrCreateTokenAccountInstruction({ mint: mint, owner: sender })];
                    case 2:
                        _a = _c.sent(), senderAta = _a.ata, ix1 = _a.ix;
                        if (ix1)
                            ixs.push(ix1);
                        return [4 /*yield*/, this.__getOrCreateTokenAccountInstruction({ mint: mint, owner: receiver, payer: sender, allowOffCurveOwner: receiverIsOffCurve })];
                    case 3:
                        _b = _c.sent(), receiverAta = _b.ata, ix2 = _b.ix;
                        if (ix2)
                            ixs.push(ix2);
                        ix = (0, spl_token_1.createTransferInstruction)(senderAta, receiverAta, sender, amount);
                        ixs.push(ix);
                        return [2 /*return*/, ixs];
                }
            });
        });
    };
    return BaseSpl;
}());
exports.BaseSpl = BaseSpl;
