import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "./App.css";
import VaultsContainer from "./containers/VaultsContainer";
import superfundLogo from "./styles/superfund_logo.jpg";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useWallet } from "@solana/wallet-adapter-react";
// import './styles/index.css'; // Adjust the path to your CSS file

// Move wallet-related logic to a component wrapped inside WalletProvider
const MainContent = () => {
  const { publicKey, connected } = useWallet(); // Now safely inside the WalletProvider context
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex container mx-auto relative overflow-x-hidden">
      {connected && publicKey && (
        <nav className="w-3/8 bg-gray-800 text-white p-6 rounded-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tighter text-zinc-100">
              SolanaFund
            </h1>
          </div>
          <ul className="space-y-4">
            <li>Vaults</li>
          </ul>
        </nav>
      )}
      <div className="flex-1 py-20 pl-6">
        <div className="relative flex flex-col items-center mb-20">
          {!connected && <Header />}
          <div className="absolute top-0 right-0 transform translate-x-[+10%] translate-y-[-90%]">
            <WalletMultiButton />
          </div>
          {connected && publicKey ? (
            <VaultsContainer publicKey={publicKey} />
          ) : (
            <div className="absolute top-0 right-0 transform translate-x-[+10%] translate-y-[-90%]">
              <WalletMultiButton />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

const App = () => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Use a child component to safely call useWallet */}
          <MainContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <img
        src={superfundLogo}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={
          {
            // filter: "drop-shadow(0px 0px 24px #a726a9a8)"
          }
        }
      />

      <h1 className="text-2xl md:text-6xl font-bold tracking-tighter mb-6 text-zinc-100">
        SolanaFund
      </h1>

      <p className="text-zinc-300 text-base">
        Please connect your wallet to get started.
      </p>
    </header>
  );
}

export default App;
