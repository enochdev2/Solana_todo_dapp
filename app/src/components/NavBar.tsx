import WalletMultiButton from "./wallet-multi-button";

import Image from "next/image";
import SolanaLogo from "../../public/solanaLogo.svg";

export function NavBar() {
  return (
    <div className="flex justify-around items-center border border-black  p-5">
      <Image src={SolanaLogo} alt="Solana Logo" width={350} height={350} />
      <WalletMultiButton />
    </div>
  );
}
