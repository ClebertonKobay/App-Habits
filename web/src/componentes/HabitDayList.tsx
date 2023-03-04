import * as Checkbox from "@radix-ui/react-checkbox"
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface HabitListProps {
    date: Date,
    onCompletedChange: (completed:number)=> void
}

interface HabitsInfo {
    possibleHabits: {
      id: string;
      tittle: string;
      created_at: string
    }[]
    completedHabit: string[],
}

export function HabitDayList({ date,onCompletedChange }: HabitListProps) {

    const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

     useEffect(()=>{
         api.get('day',{
            params:{
                date: date.toISOString(),
            }
        }).then(response => {
            setHabitsInfo(response.data)
        });
  
    },[])

    const isDayinPast = dayjs(date).endOf('day').isBefore(new Date);

    async function handleToggleHabit(habitId: string){
        const ishabitAlreadyCompleted = habitsInfo!.completedHabit.includes(habitId)
        await api.patch(`/habits/${habitId}/toggle`)
        
        let completedHabits : string[]= []

        if(ishabitAlreadyCompleted ){
            completedHabits = habitsInfo!.completedHabit.filter(id => id !== habitId)

        }else{
            completedHabits = [...habitsInfo!.completedHabit, habitId]
        }

        setHabitsInfo({
            possibleHabits: habitsInfo!.possibleHabits,
            completedHabit: completedHabits
        })

        onCompletedChange(completedHabits.length)
    }

    return (
        <div
            className="mt-6 flex flex-col gap-3"
        >
            {
                habitsInfo?.possibleHabits.map(habit => {
                    return(
                        <Checkbox.Root
                        key={habit.id}
                        onCheckedChange={()=>{
                            handleToggleHabit(habit.id)
                        }}
                        checked={habitsInfo.completedHabit.includes(habit.id)}
                        disabled={isDayinPast}
                        className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-violet-800 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed"
                    >
                        <div
                            className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors"
                        >
                            <Checkbox.Indicator>
                                <Check
                                    className="text-white"
                                    size={20}
                                />
                            </Checkbox.Indicator>
                        </div>
        
                        <span
                            className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400"
                        >
                           {habit.tittle}
                        </span>
                    </Checkbox.Root>

                    )
                })
            }

          
        </div>


    )
}