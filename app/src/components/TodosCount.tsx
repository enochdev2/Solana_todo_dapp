"use client";
import React, { useEffect, useState } from "react";
import { getPda, program, todoState, ProgramID } from "../../anchor/setup";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";

function TodosCount() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [pda, setPda] = useState<null | string>(null);
  const [count, setCount] = useState<null | number>(null);
  const fetchData = async () => {
    try {
      if (connection && publicKey && program) {
        const { pdaAddress, bump } = getPda(publicKey);
        setPda(pdaAddress.toString());
        const data = await program.account.todoState.fetch(pdaAddress);
        console.log("data is", data);
        setCount(data.totalTodos.toNumber());
      }
    } catch (error: any) {
      if (error.message.includes("Account does not exist or has no data")) {
        const transaction = await program.methods
          .initializePda()
          .accounts({
            signer: publicKey!,
          })
          .transaction();
        const transactionSignature = await sendTransaction(
          transaction,
          connection
        );

        console.log("3", transactionSignature);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [connection, publicKey, program]);

  return (
    <div className="flex flex-col">
      <p>the count is {count}</p>
      {pda}
    </div>
  );
}

export default TodosCount;
