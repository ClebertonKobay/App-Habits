import { ScrollView, View, Text, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRoute, } from "@react-navigation/native";

import { BackButton } from "../components/BackButton";
import { Progressbar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { Loading } from "../components/Loading";
import { generateProgressPercentage } from '../utils/generate-progress-percentage';
import { HabitEmpty } from "../components/HabitEmpty";

import dayjs from 'dayjs'
import { api } from "../lib/axios";
import clsx from "clsx";

interface Params {
    date: string
} 

interface DayInfoProps{
    completedHabit:string[],
    possibleHabits: Array<{
        id: string,
        tittle: string,
        created_at: string
    }>

}
export function Habit (){
    const route = useRoute();
    const { date } = route.params as Params;
    const [loading,setLoading] = useState(true);
    const [dayInfo,setDayInfo] = useState<DayInfoProps>();
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);

    const habitProgress = dayInfo?.possibleHabits.length ? generateProgressPercentage(dayInfo.possibleHabits.length,completedHabits.length) : 0;

    const parsedDate = dayjs(date);
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date)
    const dayOfWeeK = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM')

    async function fetchHabits(){
        try{
            setLoading(true);
            const response = await api.get('/day',{
                params:{
                    date:date
                }
            })
            setDayInfo(response.data)
            setCompletedHabits(response.data.completedHabit)
        }catch(error){
            console.error(error);
            Alert.alert('Ops','Não foi possivel carregar as informações dos hábitos ')
        }finally{
            setLoading(false);
        }
    } 

    async function handleTogglehabit(habitId: string) {
        try{
        if(completedHabits.includes(habitId)){
            setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
        }else{
            setCompletedHabits(prevState => [...prevState, habitId])
        }

        }catch(error){
            console.error(error);
            Alert.alert('Ops','Não foi possivel atualizar o status do hábito')
        }
        await api.patch(`/habits/${habitId}/toggle`)
    }

    useEffect(()=>{
        fetchHabits();
    },[]);

    if(loading){
        return (<Loading/>)
    }

    return(
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom:50
                }}
            >
                <BackButton/>

                <Text 
                    className="mt-6 text-zinc-400 font-semibold text-base lowercase"
                >
                    {dayOfWeeK}
                </Text>
                <Text 
                    className="text-white font-extrabold text-3xl"
                >
                    {dayAndMonth}
                </Text>
                <Progressbar progress={habitProgress}/>

                <View
                    className={clsx( "mt-6",{
                        ['opacity-40']:isDateInPast
                    } )}
                >
                    {
                        dayInfo?.possibleHabits.length ?
                            dayInfo?.possibleHabits.map(habit => {
                                return(
                                    <CheckBox 
                                        disabled={isDateInPast}
                                        onPress={()=> {
                                            handleTogglehabit(habit.id)
                                        }}
                                        checked={completedHabits.includes(habit.id)}
                                        key={habit.id}
                                        title={habit.tittle}

                                    />
                                )
                        }) 
                        : <HabitEmpty />
                        
                    }
                </View>
                {
                    isDateInPast && (
                        <Text
                            className="text-white mt-10 text-center"
                        >
                            Você não pode editar hábitos passados.
                        </Text>
                    )
                }
            </ScrollView>
        </View>
    )
}