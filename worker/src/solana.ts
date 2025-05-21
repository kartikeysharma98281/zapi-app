import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmRawTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import base58 from "bs58";


const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/asCWW_nE_5MottOGIJtjOIfVCm_dU6Bd","finalized");
export async function sendSol(to: string , amount: string){
    const keyPair = Keypair.fromSecretKey(base58.decode((process.env.SOL_PRIVATE_KEY ?? "")));
    const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: keyPair.publicKey,
            toPubkey: new PublicKey(to),
            lamports: parseFloat(amount) * LAMPORTS_PER_SOL
        })
    )
    await sendAndConfirmRawTransaction(connection , transferTransaction , [keyPair])
}