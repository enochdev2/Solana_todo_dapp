import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoSolana } from "../target/types/todo_solana";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";

describe("todo-solana", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TodoSolana as Program<TodoSolana>;

  let todoPdaAccount: PublicKey;
  let todoBump: Number;
  let [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("TODO_ACC"), provider.publicKey.toBuffer()],
    program.programId
  );

  todoPdaAccount = pda;
  todoBump = bump;

  it("Is initializes PDA", async () => {
    const tx = await program.methods
      .initializePda()
      .accounts({
        signer: provider.publicKey,
      })
      .rpc();

    console.log("transaction", tx);
    const account = await program.account.todoState.fetch(todoPdaAccount);
    expect(account.bump).to.equal(todoBump);
    expect(account.totalTodos.toNumber()).to.equal(0);
  });

  it("add todo", async () => {
    const description = "Test Todo";

    const tx = await program.methods
      .addTodo(description)
      .accounts({
        signer: provider.publicKey,
      })
      .rpc();

    console.log("transaction successfull", tx);

    const account = await program.account.todoState.fetch(todoPdaAccount);
    console.log("the todos are", account.totalTodos);
    console.log("todos", account.todos);
  });

  it("update todo", async () => {
    const index = 0;
    const is_completed = true;
    const tx = await program.methods
      .updateTodo(index, is_completed)
      .accounts({
        signer: provider.publicKey,
      })
      .rpc();

    const todo = await program.account.todoState.fetch(todoPdaAccount);
    console.log("todo updated", todo.todos);
  });
});
