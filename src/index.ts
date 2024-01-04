import { AnchorProvider, Wallet, web3 } from "@project-serum/anchor";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { BaseMpl } from "./base/baseMpl";
import { mintingConfig } from "./mintingConfig";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";

const log = console.log;
const rpcUrl = mintingConfig.isMain ? mintingConfig.rpcUrlMain : mintingConfig.rpcUrlDev

const connection = new web3.Connection(rpcUrl)
let baseMpl: BaseMpl;
let payerKp: web3.Keypair | null = null
const _payerKey = mintingConfig.payer;
if (!_payerKey) throw "Payer key not found"
if (typeof _payerKey == 'string')
  payerKp = web3.Keypair.fromSecretKey(Uint8Array.from(bs58.decode(_payerKey)))
else
  payerKp = web3.Keypair.fromSecretKey(Uint8Array.from(_payerKey))
log("nftOwner: ", payerKp.publicKey.toBase58())
log("\n")

async function mint() {
  if (!payerKp) throw "Unable to parse payer key"
  let receiver = mintingConfig.nftReceiver ? new web3.PublicKey(mintingConfig.nftReceiver) : payerKp.publicKey
  const _wallet = new Wallet(payerKp)
  const provider = new AnchorProvider(connection, _wallet, {});
  baseMpl = new BaseMpl(provider.wallet, { endpoint: connection.rpcEndpoint })

  const tokenKp = web3.Keypair.generate()
  const token = tokenKp.publicKey
  log("nftId: ", token.toBase58())

  const name = mintingConfig.nftName
  const symbol = mintingConfig.nftSymbol
  const uri = mintingConfig.nftUri

  //NOTE: Minting  a NFT
  const mintNftRes = await baseMpl.__createToken({
    mintTokens: false,
    name,
    symbol,
    uri,
    sellerFeeBasisPoints: 0,
    tokenStandard: TokenStandard.NonFungible,
  }, { mintKeypair: tokenKp, mintAmount: 1, receiver, decimal: 0 })
  log("mintNftTxSign : ", mintNftRes)
}

async function runner() {
  while (true) {
    const res =
      await mint().then((_) => {
        log("\n")
        return true
      }).catch((error) => {
        log({ error })
        return false
      })

    if (!res) break;
  }
}

runner().then((_) => {
  log("Success")
}).catch((error) => {
  log({ error })
})
