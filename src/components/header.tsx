import React from 'react';
import Web3Button from './web3-button';
import { Badge } from './ui/badge';
import { Cpu } from 'lucide-react';

type HeaderProps = {
  is3DReady: boolean;
};

const Header: React.FC<HeaderProps> = ({ is3DReady }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <Cpu className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-xl font-bold font-headline tracking-tighter">
            Autonomous Structural Intelligence System
          </h1>
          <p className="text-sm text-muted-foreground">
            Hackathon Track: AI-Powered Web3 Infrastructure
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Web3Button is3DReady={is3DReady} />
      </div>
    </header>
  );
};

export default Header;
