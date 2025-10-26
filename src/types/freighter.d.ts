// Freighter wallet API types
interface Freighter {
  isConnected: () => Promise<boolean>;
  getPublicKey: () => Promise<string>;
  signTransaction: (xdr: string, opts?: any) => Promise<string>;
  getNetwork: () => Promise<string>;
}

interface Window {
  freighter?: Freighter;
}