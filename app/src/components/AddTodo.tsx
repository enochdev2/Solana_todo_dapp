"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { program } from "../../anchor/setup";

export default function AddTodo() {
  const [input, setInput] = useState<string>("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const addTodo = async () => {
    try {
      if (!connection) return;

      if (input.trim().length == 0) {
        return;
      }
      const tx = await program.methods
        .addTodo(input)
        .accounts({
          signer: publicKey!,
        })
        .transaction();
      const sign = await sendTransaction(tx, connection);
      console.log("sign after adding", sign);
    } catch (error) {
      console.log("something went wront while adding todo", error);
    }
  };

  return (
    <div className="border border-black flex p-5 gap-2">
      <Input
        type="text"
        placeholder="Add a new todo..."
        className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors"
        onChange={(e: any) => setInput(e.target.value)}
      />
      <Button
        type="submit"
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        onClick={addTodo}
      >
        Add Todo
      </Button>
    </div>
  );
}
