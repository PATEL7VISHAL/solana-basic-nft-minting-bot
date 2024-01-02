import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createTransferInstruction,
  getAccount as getTokenAccountInfo,
  unpackAccount as unpackTokenAccount,
  createBurnInstruction,
  getMint,
} from "@solana/spl-token";
import { web3 } from "@project-serum/anchor";

const log = console.log;
export function calcNonDecimalValue(value: number, decimals: number): number {
  return Math.trunc(value * (Math.pow(10, decimals)))
}

export function calcDecimalValue(value: number, decimals: number): number {
  return value / (Math.pow(10, decimals))
}


export type createTokenOptions = {
  mintAuthority: web3.PublicKey;
  /** default `mintAuthority` */
  payer?: web3.PublicKey;
  /** default `mintAuthority` */
  freezAuthority?: web3.PublicKey;
  /** default `0` */
  decimal: number;
  /** default `web3.Keypair.generate()` */
  mintKeypair?: web3.Keypair,
  /** default `null` to avoid minting*/
  minting?: {
    /** default `1` */
    tokenAmount?: number;
    /** default `mintAuthority` */
    receiver?: web3.PublicKey
  };
};



export type getOrCreateTokenAccountOptons = {
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  /** default (`owner`) */
  payer?: web3.PublicKey,
  /** default (`false`) */
  allowOffCurveOwner?: boolean;
  checkCache?: boolean
}

export type TransferInput = {
  sender: web3.PublicKey | string,
  receiver: web3.PublicKey | string
  mint: web3.PublicKey | string,
  amount: number,
  receiverIsOffCurve?: boolean,
}


export class BaseSpl {
  __connection: web3.Connection;
  __splIxs: web3.TransactionInstruction[] = [];
  __cacheAta: Set<String>;

  constructor(connection: web3.Connection) {
    this.__connection = connection;
    this.__cacheAta = new Set();
  }

  __reinit() {
    this.__splIxs = [];
    this.__cacheAta = new Set();
  }

  async __getCreateTokenInstructions(opts: createTokenOptions) {
    this.__reinit();
    let {
      decimal,
      mintAuthority,
      freezAuthority,
      payer,
      minting,
      mintKeypair,
    } = opts;
    payer = payer ?? mintAuthority;
    freezAuthority = freezAuthority ?? mintAuthority
    decimal = decimal ?? 0
    mintKeypair = mintKeypair ?? web3.Keypair.generate();

    const mint = mintKeypair.publicKey;
    const rent = await this.__connection.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );

    const ix1 = web3.SystemProgram.createAccount({
      fromPubkey: payer,
      lamports: rent,
      newAccountPubkey: mintKeypair.publicKey,
      programId: TOKEN_PROGRAM_ID,
      space: MINT_SIZE,
    });
    this.__splIxs.push(ix1);

    const ix2 = createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimal,
      mintAuthority,
      freezAuthority
    );
    this.__splIxs.push(ix2);

    if (minting) {
      let { tokenAmount, receiver } = minting
      receiver = receiver ?? mintAuthority
      tokenAmount = tokenAmount ?? 1;
      tokenAmount = (10 ** decimal) * tokenAmount

      const { ata, ix: createTokenAccountIx } =
        this.__getCreateTokenAccountInstruction(
          mint,
          receiver,
        );
      this.__splIxs.push(createTokenAccountIx);

      const ix3 = createMintToInstruction(
        mint,
        ata,
        mintAuthority,
        tokenAmount
      );
      this.__splIxs.push(ix3);
    }

    return {
      mintKeypair: mintKeypair,
      ixs: this.__splIxs,
    };
  }
  __getCreateTokenAccountInstruction(
    mint: web3.PublicKey,
    owner: web3.PublicKey,
    allowOffCurveOwner: boolean = false,
    payer?: web3.PublicKey
  ) {
    const ata = getAssociatedTokenAddressSync(mint, owner, allowOffCurveOwner);
    const ix = createAssociatedTokenAccountInstruction(
      payer ?? owner,
      ata,
      owner,
      mint
    );

    return {
      ata,
      ix,
    };
  }

  async __getOrCreateTokenAccountInstruction(
    input: getOrCreateTokenAccountOptons,
    ixCallBack?: (ixs?: web3.TransactionInstruction[]) => void
  ) {
    let {
      owner,
      mint,
      payer,
      allowOffCurveOwner,
      checkCache
    } = input;
    allowOffCurveOwner = allowOffCurveOwner ?? false
    payer = payer ?? owner;

    const ata = getAssociatedTokenAddressSync(mint, owner, allowOffCurveOwner);
    let ix = null;
    const info = await this.__connection.getAccountInfo(ata);

    if (!info) {
      ix = createAssociatedTokenAccountInstruction(
        payer ?? owner,
        ata,
        owner,
        mint
      );
      if (ixCallBack) {
        if (checkCache) {
          if (!this.__cacheAta.has(ata.toBase58())) {
            ixCallBack([ix])
            this.__cacheAta.add(ata.toBase58())
          } else log("ata init already exist")
        } else {
          ixCallBack([ix])
        }
      }
    }

    return {
      ata,
      ix,
    };
  }

  async _getTransferInstructions(input: TransferInput) {
    let {
      mint,
      sender,
      receiver,
      amount: _amount,
      receiverIsOffCurve,
    } = input;
    receiverIsOffCurve = receiverIsOffCurve ?? false;

    if (typeof mint == 'string') mint = new web3.PublicKey(mint)
    if (typeof sender == 'string') sender = new web3.PublicKey(sender)
    if (typeof receiver == 'string') receiver = new web3.PublicKey(receiver)

    const ixs: web3.TransactionInstruction[] = [];
    const mintInfo = await getMint(this.__connection, mint);
    const decimal = mintInfo.decimals;
    const amount = calcNonDecimalValue(_amount, decimal);

    const { ata: senderAta, ix: ix1 } = await this.__getOrCreateTokenAccountInstruction({ mint, owner: sender })
    if (ix1) ixs.push(ix1)
    const { ata: receiverAta, ix: ix2 } = await this.__getOrCreateTokenAccountInstruction({ mint, owner: receiver, payer: sender, allowOffCurveOwner: receiverIsOffCurve })
    if (ix2) ixs.push(ix2)

    const ix = createTransferInstruction(senderAta, receiverAta, sender, amount);
    ixs.push(ix)
    return ixs
  }
}
