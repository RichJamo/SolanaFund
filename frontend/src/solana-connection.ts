import { Connection, PublicKey, AccountInfo } from '@solana/web3.js';

const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/oFfvEpXYjGo8Nj4QQIkU3kXd6Z0JvfJZ', 'confirmed');

export const fetchAccountInfo = async (publicKey: PublicKey): Promise<AccountInfo<Buffer> | null> => {
  const accountInfo = await connection.getAccountInfo(publicKey);
  console.log('Account Info:', accountInfo);
  return accountInfo;
};