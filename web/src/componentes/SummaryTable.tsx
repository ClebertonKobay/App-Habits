import { generateDatesFromYearsBeginning } from "../utils/generate-dates-from-years-beginning";
import { HabitDay } from "./HabitDay";

const weekDays = ['D','S','T','Q','Q','S','S']

const summaryDates = generateDatesFromYearsBeginning();

const minimumSummaryDates = 18 * 7;
const amountOfDayToFill = minimumSummaryDates - summaryDates.length;

export function SummaryaTable(){
    return(
      <div className="w-full flex ">
        <div className="grid grid-rows-7 grid-flow-row gap-3">
            {weekDays.map((weekDay, i) => {
                return(
                    <div 
                        key={`${weekDay}-${i}`} 
                        className="text-zinc-400 text-xl font-bold w-10 h-10 flex items-center justify-center"
                        >
                        {weekDay}
                    </div>
                )
            })}
        </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3 ">
                {
                    summaryDates.map(date => {
                        return(
                            <HabitDay 
                            amount={10} 
                            completed={Math.round(Math.random() * 10)} 
                            key={date.toString()}/>
                        )
                    })
                }
                {
                    amountOfDayToFill > 0 && Array.from({ length: amountOfDayToFill}).map((_,i)=>{
                        return(
                            <div key={i} className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"></div>
                        )
                    })
                }
            </div>

      </div>  
    );
}