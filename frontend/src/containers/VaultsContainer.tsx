import { useState, useEffect } from "react";
import { fetchVaultData } from "../utils/api";
import { formatTotalAssets } from "../utils/utils";
import {
  executeDeposit,
  executeWithdrawal,
  fetchUserVaultBalance,
} from "../actions/actions";
import VaultsView from "../components/VaultsView";
import { FormattedVault, VaultData } from "../types/types";
import { VAULT_IDS } from "../constants/index";
import { useWallet } from "@solana/wallet-adapter-react";
import { getUSDCBalance } from "../actions/actions";
import { PublicKey } from "@solana/web3.js";

const VaultsContainer = ({ publicKey }: { publicKey: PublicKey }) => {
  const [vaults, setVaults] = useState<FormattedVault[]>([]);
  const [transactionAmount, setTransactionAmount] = useState("1");
  const [loading, setLoading] = useState<boolean>(true);
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  console.log("publicKey1", typeof publicKey)
  // const [activeAccount, setActiveAccount] = useState<AccountInfo<Buffer>  | null>(null);
  const publicKeyString = publicKey ? publicKey.toString() : null;
  console.log("publicKey2", typeof publicKey)

  // const contract = getContract({
  //   client,
  //   chain: arbitrum,
  //   address: ARBITRUM_USDC_CONTRACT_ADDRESS,
  // });

  async function updateUserVaultBalances(formattedVaults: FormattedVault[]) {
    // Create a new array with updated vault balances
    const updatedVaults = await Promise.all(
      formattedVaults.map(async (vault) => {
        try {
          const balance = await fetchUserVaultBalance(
            publicKeyString,
            vault.id as Address
          );
          return { ...vault, userBalance: balance }; // Return updated vault
        } catch (error) {
          console.error(`Error fetching balance for vault ${vault.id}:`, error);
          return { ...vault, userBalance: "Error" }; // Handle error
        }
      })
    );
  
    // Update the state with the new array
    setVaults(updatedVaults);
  }
  
  async function updateUsdcBalance(publicKey: PublicKey) {
    // Create a new array with updated vault balances
    const usdcBalance = await getUSDCBalance(publicKey)
    if (usdcBalance) {
      setUsdcBalance(usdcBalance.toString());
    }
  }

  const handleDepositTransaction = async (vaultId) => {
    try {
      setTransactionAmount;
      const value = Number(transactionAmount)
      const scaledAmount = BigInt(value * 10**6)
      await executeDeposit(
        vaultId,
        publicKeyString,
        scaledAmount, //TODO make this general for all tokens?
      );
      console.log("Transaction confirmed")
      // refetch();
      updateUserVaultBalances(vaults);
    } catch (error) {
      throw new Error("Transaction failed");
    }
  };

  const handleWithdrawTransaction = async (vaultId) => {
    try {
      setTransactionAmount;
      const value = Number(transactionAmount)
      const scaledAmount = BigInt(value * 10**6)
      await executeWithdrawal(
        vaultId,
        publicKeyString,
        scaledAmount,
      );
      // refetch();
      updateUserVaultBalances(vaults);
    } catch (error) {
      throw new Error("Transaction failed");
    }
  };

  
  


    useEffect(() => {
    async function init() {
      try {
        const data: VaultData[] = await fetchVaultData(VAULT_IDS);
  
        const formattedVaults: FormattedVault[] = data.map((vaultData) => {
          const { id, inputToken, name, rates, totalValueLockedUSD } =
            vaultData;
  
          const lenderVariableRate = rates.find(
            (rate) => rate.type === "VARIABLE" && rate.id.startsWith("LENDER")
          );
          const borrowerVariableRate = rates.find(
            (rate) => rate.type === "VARIABLE" && rate.id.startsWith("BORROWER")
          );
  
          return {
            id,
            name: name || "Unnamed Vault",
            symbol: inputToken.symbol || "N/A",
            chain: "Solana",
            protocol: "Vaultka",
            totalAssets: totalValueLockedUSD
              ? formatTotalAssets(totalValueLockedUSD, inputToken.decimals)
              : "N/A",
            previewPPS: lenderVariableRate
              ? `${parseFloat(lenderVariableRate.rate).toFixed(2)}%`
              : "N/A",
            pricePerVaultShare: borrowerVariableRate
              ? `${parseFloat(borrowerVariableRate.rate).toFixed(2)}%`
              : "N/A",
            apy7d: lenderVariableRate
              ? `${parseFloat(lenderVariableRate.rate).toFixed(2)}%`
              : "N/A",
            userBalance: "N/A",
          };
        });
  
        setVaults(formattedVaults);
  
        // Fetch user balances after setting the vaults
        // await updateUserVaultBalances(formattedVaults);
        await updateUsdcBalance(publicKey);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    }
    if (publicKey) {
      init();
    }
  }, [publicKey]);
  

  // const handleUserChange = (username: string) => {
  // };

  return (
    <VaultsView
      loading={loading}
      vaults={vaults}
      transactionAmount={transactionAmount}
      setTransactionAmount={setTransactionAmount}
      depositTransaction={handleDepositTransaction}
      withdrawTransaction={handleWithdrawTransaction}
      usdcBalance={usdcBalance}
    />
  );
};

export default VaultsContainer;
