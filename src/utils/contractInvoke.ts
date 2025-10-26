import * as StellarSdk from '@stellar/stellar-sdk';
import * as freighterApi from '@stellar/freighter-api';

const CONTRACT_ADDRESS = 'CDHBVTCJ7GMRVMXW5GB5K46JJUYFBFFPFVBL3SQQSU4KAGBURMQUR5LN';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';

export async function invokeCreateGoal(
  goalAmount: number,
  depositAmount: number
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    console.log('🔐 Checking Freighter connection...');
    
    // Check Freighter is connected
    const connected = await freighterApi.isConnected();
    if (!connected) {
      return { success: false, error: 'Freighter wallet not installed' };
    }

    // Get user's address
    const addressResult = await freighterApi.getAddress();
    const publicKey = addressResult.address;
    console.log('✅ User wallet:', publicKey);

    // Connect to Soroban RPC
    const server = new StellarSdk.SorobanRpc.Server(SOROBAN_RPC_URL);
    
    // Get account from Soroban RPC
    const sourceAccount = await server.getAccount(publicKey);
    
    // Build contract instance
    const contract = new StellarSdk.Contract(CONTRACT_ADDRESS);
    
    // Build the contract call operation
    const builtTransaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'create_goal',
          StellarSdk.Address.fromString(publicKey).toScVal(),
          StellarSdk.nativeToScVal(goalAmount, { type: 'i128' }),
          StellarSdk.nativeToScVal(depositAmount, { type: 'i128' }),
          StellarSdk.xdr.ScVal.scvSymbol('weekly')
        )
      )
      .setTimeout(30)
      .build();

    console.log('📝 Simulating transaction...');

    // Simulate the transaction first (required for Soroban)
    const preparedTransaction = await server.prepareTransaction(builtTransaction);

    console.log('✅ Transaction prepared, requesting signature...');

    // Sign with Freighter (this will show popup!)
    const signedResult = await freighterApi.signTransaction(preparedTransaction.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    console.log('✅ Transaction signed!');

    // Rebuild signed transaction
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedResult.signedTxXdr,
      NETWORK_PASSPHRASE
    );

    // Submit to Soroban RPC
    console.log('🌐 Submitting to Stellar network...');
    const response = await server.sendTransaction(signedTx);
    
    console.log('✅ Transaction sent! Hash:', response.hash);
    
    // Wait for confirmation
    if (response.status === 'PENDING') {
      console.log('⏳ Waiting for confirmation...');
      let attempts = 0;
      while (attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const txResponse = await server.getTransaction(response.hash);
        if (txResponse.status === 'SUCCESS') {
          console.log('✅ Transaction confirmed!');
          return { success: true, txHash: response.hash };
        }
        if (txResponse.status === 'FAILED') {
          console.error('❌ Transaction failed');
          return { success: false, error: 'Transaction failed on-chain' };
        }
        attempts++;
      }
    }
    
    return { success: true, txHash: response.hash };
    
  } catch (error: any) {
    console.error('❌ Contract invocation failed:', error);
    return { success: false, error: error.message };
  }
}