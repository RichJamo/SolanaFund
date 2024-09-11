import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
// import { TOKEN_PROGRAM_ID, createTransferCheckedInstruction, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, getAccount } from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
// import { Signer } from "@solana/web3.js";

// Define the USDC mint address for mainnet or devnet
const USDC_MINT_ADDRESS = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); // Mainnet

// Replace with your actual connection (devnet or mainnet)
const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/oFfvEpXYjGo8Nj4QQIkU3kXd6Z0JvfJZ", "confirmed");

export const executeDeposit = async (
  vaultId: PublicKey,        // Vault program ID
  activeAccount: WalletContextState,  // WalletContextState, which provides both PublicKey and Signer (wallet)
  transactionAmount: bigint, // Amount to deposit (USDC)
  usdcMintAddress: PublicKey // USDC Mint Address
) => {
  // try {
  //   const { publicKey, signTransaction, wallet } = activeAccount;

  //   if (!publicKey || !signTransaction || !wallet?.adapter) {
  //     throw new Error("Wallet not connected or unable to sign transaction");
  //   }

  //   // Use the wallet adapter as the payer (which is a Signer)
  //   const payer = wallet.adapter;

  //   // Step 1: Get or create the associated token account for USDC
  //   const userUSDCAccount = await getOrCreateAssociatedTokenAccount(
  //     connection,
  //     payer,           // Use the wallet's Signer as the payer
  //     usdcMintAddress, // USDC Mint Address
  //     publicKey        // Owner of the USDC token account
  //   );

  //   // Step 2: Get the associated token account of the vault (where USDC is deposited)
  //   const vaultUSDCAccount = await getAssociatedTokenAddress(
  //     usdcMintAddress, // USDC Mint Address
  //     vaultId // The vault program ID acts as the owner
  //   );

  //   // Step 3: Create the TransferChecked instruction for transferring USDC from user to vault
  //   const transferInstruction = createTransferCheckedInstruction(
  //     userUSDCAccount.address,       // User's USDC token account
  //     usdcMintAddress,               // USDC mint
  //     vaultUSDCAccount,              // Vault's USDC token account
  //     publicKey,                     // User's public key (signer)
  //     Number(transactionAmount),     // Amount to transfer (in smallest units)
  //     6                              // Decimals for USDC (USDC has 6 decimals)
  //   );

  //   // Step 4: Create the custom Deposit instruction for the vault program
  //   const depositInstruction = new TransactionInstruction({
  //     keys: [
  //       { pubkey: publicKey, isSigner: true, isWritable: false },
  //       { pubkey: userUSDCAccount.address, isSigner: false, isWritable: true },
  //       { pubkey: vaultUSDCAccount, isSigner: false, isWritable: true },
  //     ],
  //     programId: vaultId, // Vault program ID
  //     data: Buffer.from([]), // Custom data for the deposit instruction (if required)
  //   });

  //   // Step 5: Create the transaction and add both instructions
  //   const transaction = new Transaction().add(transferInstruction, depositInstruction);

  //   // Step 6: Sign the transaction with the wallet
  //   const signedTransaction = await signTransaction(transaction);

  //   // Step 7: Send the transaction and confirm it
  //   const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
  //     skipPreflight: false,
  //     preflightCommitment: "confirmed",
  //   });

  //   await connection.confirmTransaction(signature, "confirmed");

  //   console.log("Deposit transaction confirmed");
  // } catch (error) {
  //   console.error("Error executing deposit:", error);
  // }
};


export const executeWithdrawal = async (
  vaultId: PublicKey,
  activeAccount: PublicKey,
  withdrawAmount: bigint
) => {
  //   try {
  //     // Fetch or create the associated token account for the USDC token for the user
  //     const userTokenAccount = await getOrCreateAssociatedTokenAccount(
  //       connection,
  //       activeAccount,
  //       new PublicKey(USDC_MINT_ADDRESS), // Replace with the USDC token mint address
  //       activeAccount
  //     );

  //     // Create transaction instruction to withdraw USDC from the vault program
  //     const withdrawInstruction = createTransferInstruction(
  //       vaultId, // Vault program address
  //       userTokenAccount.address, // User's token account to receive withdrawal
  //       activeAccount,
  //       Number(withdrawAmount),
  //       [],
  //       TOKEN_PROGRAM_ID
  //     );

  //     // Create transaction
  //     const transaction = new Transaction().add(withdrawInstruction);

  //     // Sign and send transaction
  //     const signature = await connection.sendTransaction(transaction, [activeAccount]);
  //     await connection.confirmTransaction(signature, "confirmed");

  //     console.log("Withdrawal transaction confirmed");
  //   } catch (error) {
  //     console.error("Error executing withdrawal:", error);
  //   }
};

export const fetchUserVaultBalance = async (userAddress: PublicKey, vaultAddress: PublicKey) => {
  try {
    // Fetch the user's token account balance for the USDC token in the vault
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      userAddress,
      new PublicKey(USDC_MINT_ADDRESS), // Replace with the USDC mint address
      userAddress
    );

    const balance = await getAccount(connection, userTokenAccount.address);
    return balance.amount; // Returns the token balance
  } catch (error) {
    console.error("Error fetching vault balance:", error);
  }
};

// The program ID for the SPL Token program
const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

// Helper function to find the associated token account
const getAssociatedTokenAccountAddress = async (
  mintAddress: PublicKey,
  ownerAddress: PublicKey
) => {
  // Derive the associated token account address for the given wallet and mint
  const associatedTokenAccountAddress = PublicKey.findProgramAddressSync(
    [
      ownerAddress.toBuffer(),    // Wallet's public key
      TOKEN_PROGRAM_ID.toBuffer(), // SPL Token Program ID
      mintAddress.toBuffer(),      // Token mint address (e.g., USDC)
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID   // Associated Token Program ID
  )[0];

  return associatedTokenAccountAddress;
};

// Function to fetch USDC balance using web3.js only
export const getUSDCBalance = async (walletPublicKey: PublicKey) => {
  try {
    const usdcTokenAccountAddress = await getAssociatedTokenAccountAddress(
      USDC_MINT_ADDRESS,
      walletPublicKey
    );

    // Step 2: Fetch the token account data from the blockchain
    const accountInfo = await connection.getParsedAccountInfo(usdcTokenAccountAddress);

    // Step 3: Check if the account exists and is a token account
    if (accountInfo.value && accountInfo.value.data["parsed"]) {
      const parsedData = accountInfo.value.data["parsed"];
      const balance = BigInt(parsedData.info.tokenAmount.amount); // Balance is in smallest units (6 decimals)

      // Convert balance to human-readable format (e.g., divide by 10^6 for USDC)
      console.log(balance)
      const readableBalance = (Number(balance) / 10 ** 6).toFixed(2);
      console.log(`USDC Balance: ${readableBalance}`);
      return readableBalance;
    } else {
      console.log("No USDC token account found for this wallet.");
      return 0;
    }
  } catch (error) {
    console.error("Error fetching USDC balance:", error);
    return 0;
  }
};

