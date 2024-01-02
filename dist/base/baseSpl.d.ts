import { web3 } from "@project-serum/anchor";
export declare function calcNonDecimalValue(value: number, decimals: number): number;
export declare function calcDecimalValue(value: number, decimals: number): number;
export type createTokenOptions = {
    mintAuthority: web3.PublicKey;
    /** default `mintAuthority` */
    payer?: web3.PublicKey;
    /** default `mintAuthority` */
    freezAuthority?: web3.PublicKey;
    /** default `0` */
    decimal: number;
    /** default `web3.Keypair.generate()` */
    mintKeypair?: web3.Keypair;
    /** default `null` to avoid minting*/
    minting?: {
        /** default `1` */
        tokenAmount?: number;
        /** default `mintAuthority` */
        receiver?: web3.PublicKey;
    };
};
export type getOrCreateTokenAccountOptons = {
    mint: web3.PublicKey;
    owner: web3.PublicKey;
    /** default (`owner`) */
    payer?: web3.PublicKey;
    /** default (`false`) */
    allowOffCurveOwner?: boolean;
    checkCache?: boolean;
};
export type TransferInput = {
    sender: web3.PublicKey | string;
    receiver: web3.PublicKey | string;
    mint: web3.PublicKey | string;
    amount: number;
    receiverIsOffCurve?: boolean;
};
export declare class BaseSpl {
    __connection: web3.Connection;
    __splIxs: web3.TransactionInstruction[];
    __cacheAta: Set<String>;
    constructor(connection: web3.Connection);
    __reinit(): void;
    __getCreateTokenInstructions(opts: createTokenOptions): Promise<{
        mintKeypair: web3.Keypair;
        ixs: web3.TransactionInstruction[];
    }>;
    __getCreateTokenAccountInstruction(mint: web3.PublicKey, owner: web3.PublicKey, allowOffCurveOwner?: boolean, payer?: web3.PublicKey): {
        ata: web3.PublicKey;
        ix: web3.TransactionInstruction;
    };
    __getOrCreateTokenAccountInstruction(input: getOrCreateTokenAccountOptons, ixCallBack?: (ixs?: web3.TransactionInstruction[]) => void): Promise<{
        ata: web3.PublicKey;
        ix: web3.TransactionInstruction | null;
    }>;
    _getTransferInstructions(input: TransferInput): Promise<web3.TransactionInstruction[]>;
}
