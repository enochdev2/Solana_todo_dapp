use anchor_lang::prelude::*;

declare_id!("3Dz8ofmvtfGHZhEXdqQSNftNbpnXJcUwrK231aamwDiD");

#[program]
pub mod todo_solana {
    use super::*;

    pub fn initialize_pda(ctx:Context<InitializaPda>)->Result<()>{
        msg!("Before Initializing PDA account");
        let account=&mut ctx.accounts.todo_account;
        account.bump=ctx.bumps.todo_account;
        account.total_todos=0;
        msg!("After Intializeng PDA account");
        Ok(())
    }
    pub fn add_todo(ctx:Context<AddTodo>,description:String)->Result<()>{
        msg!("Before adding Todo");
        let todo_state=&mut ctx.accounts.todo_account;
        todo_state.total_todos+=1;
        let todo=Todo{
            description,
            is_completed:false
        };
        todo_state.todos.push(todo); 
        Ok(())
    }
    pub fn update_todo(ctx:Context<UpdateTodo>,index:u8,is_completed:bool)->Result<()>{
        let todo_state=&mut ctx.accounts.todo_account;
        msg!("Before updating the todo"); 
        let i=index as usize;
        todo_state.todos[i].is_completed=is_completed;
        msg!("Successfull Updated");
        Ok(())
    }   
}

#[derive(Accounts)]
pub struct InitializaPda<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,
    #[account(
        init,
        seeds=[b"TODO_ACC",signer.key().as_ref()],
        payer=signer,
        bump,
        space=8+TodoState::INIT_SPACE,
    )]
    pub todo_account:Account<'info,TodoState>,
    pub system_program:Program<'info,System>
}


#[derive(Accounts)]
pub struct AddTodo<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,
    #[account(
        mut,
        seeds=[b"TODO_ACC",signer.key().as_ref()],
        bump=todo_account.bump
    )]
    pub todo_account:Account<'info,TodoState>,
}

#[derive(Accounts)]
pub struct UpdateTodo<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,
    #[account(
        mut,
        seeds=[b"TODO_ACC",signer.key().as_ref()],
        bump=todo_account.bump
    )]
    pub todo_account:Account<'info,TodoState>,
}


#[account]
#[derive(InitSpace)]
pub struct TodoState{
    pub key:Pubkey,
    pub bump:u8,
    #[max_len(10,5)]
    pub todos:Vec<Todo>,
    pub total_todos:u64
}

#[derive(AnchorDeserialize,AnchorSerialize,Clone,Debug,InitSpace)]
pub struct Todo{
    #[max_len(50)]
    pub description:String,
    pub is_completed:bool,
}