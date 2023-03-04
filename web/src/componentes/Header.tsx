import React, { useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import logoImage from '../assets/Logo.svg'
import { Plus, X } from  'phosphor-react'
import { NewHabitForm } from "./newHabitForm";

export function Header () {
    return(
        <div className='w-full max-w-3xl mx-auto flex items-center justify-between'>
            <img src={logoImage} alt="Logo escrito Habits" />

            <Dialog.Root>
                <Dialog.Trigger
                type='button' 
                className='border border-violet-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:border-violet-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-800 focus:ring-offset-2 focus:ring-offset-background' 
                >
                <Plus size={20} className="text-violet-500" />
                Novo Hábito
                </Dialog.Trigger>
                
                <Dialog.Portal>
                    <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0"/>
                    <Dialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-screen h-screen max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Dialog.Close className="absolute right-6 top-6 border-0 text-zinc-400 hover:text-zinc-200">
                            <X size={24} aria-label="Fechar" className="border-0"/>
                        </Dialog.Close>
                        <Dialog.Title className="text-3xl leading-tight text-white font-bold">
                            Criar Hábito
                        </Dialog.Title>
                        <NewHabitForm/>
                    </Dialog.Content>
                </Dialog.Portal>

            </Dialog.Root>

        </div>
    )
}