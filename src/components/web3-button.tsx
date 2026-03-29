"use client";

import React, { useState, useEffect } from 'react';
import { isConnected, getPublicKey, signTransaction } from '@stellar/freighter-api';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Check, AlertTriangle, Fingerprint } from 'lucide-react';

interface Web3ButtonProps {
  is3DReady: boolean;
}

const Web3Button: React.FC<Web3ButtonProps> = ({ is3DReady }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await isConnected();
      if (connected) {
        const key = await getPublicKey();
        setPublicKey(key);
        setWalletConnected(true);
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      const connected = await isConnected();
      if (connected) {
        toast({
          title: "Wallet Already Connected",
          description: "Your Freighter wallet is ready.",
          variant: "default",
        });
        return;
      }
      
      const key = await getPublicKey();
      setPublicKey(key);
      setWalletConnected(true);
      toast({
        title: "Wallet Connected",
        description: `Public key: ${key.substring(0, 10)}...${key.substring(key.length - 10)}`,
        action: <Check className="text-green-500" />,
      });
    } catch (e) {
      toast({
        title: "Connection Failed",
        description: (e as Error).message,
        variant: "destructive",
        action: <AlertTriangle />,
      });
    }
  };

  const handleVerifyAudit = async () => {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to verify.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Signing Transaction...",
      description: "Please approve the transaction in your Freighter wallet.",
    });

    // Mock transaction
    setTimeout(() => {
      const dummyTxHash = `mock_tx_${Date.now()}${Math.random().toString(36).substring(2, 15)}`;
      toast({
        title: "Audit Verified on Stellar (Mock)",
        description: (
            <div className='font-code text-xs'>
                Tx Hash: {dummyTxHash}
            </div>
        ),
        action: <Check className="text-green-500" />,
      });
    }, 2000);
  };

  if (!walletConnected) {
    return (
      <Button onClick={connectWallet}>
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className='flex items-center gap-4'>
        <div className="text-right">
            <p className="text-sm font-semibold text-primary">Wallet Connected</p>
            <p className="text-xs font-code text-muted-foreground">{`${publicKey.substring(0, 6)}...${publicKey.substring(publicKey.length - 6)}`}</p>
        </div>
        <Button onClick={handleVerifyAudit} disabled={!is3DReady} variant="outline" className='bg-accent text-accent-foreground hover:bg-accent/90'>
            <Fingerprint className="mr-2 h-4 w-4" />
            Verify Audit on Stellar
        </Button>
    </div>
  );
};

export default Web3Button;
