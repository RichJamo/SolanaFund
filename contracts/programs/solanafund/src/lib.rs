use anchor_lang::prelude::*;

declare_id!("3vsKvjsDC8TEjuaZqacxSmNgQB3Rua8nGLXE9AeRPaNW");

#[program]
pub mod solanafund {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
