import { View, Text, ScrollView, Alert } from "react-native";
import { useState, useEffect} from "react";
import { generateDatesFromYearsBeginning } from '../utils/generate-dates-from-years-beginning';
import { HabitDay, daySize } from "../components/HabitDay";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";

import { api } from '../lib/axios'
import { Loading } from "../components/loading";
import dayjs from "dayjs";

const weekDays = ['D','S','T','Q','Q','S','S']

const datesFromYearsStart = generateDatesFromYearsBeginning();

const minimumSummaryDates = 18 * 5;
const amountOfDaysToFill = minimumSummaryDates - datesFromYearsStart.length;

type SummaryProps =  Array<{
    id: string
    date: string
    completed: number
    amount:number
}>

export function Home(){
    const { navigate } = useNavigation();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<SummaryProps | null >(null);

    async function fetchData(){
        try{
            setLoading(true);
            const response = await api.get('summary');
            setSummary(response.data);
        }catch (error){
            Alert.alert('Ops','Nao foi possivel carregar o sumário de dados');
            console.error(error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchData();
    },[])

    if(loading){
        return <Loading />
    }

    return(
        <View className="flex-1 bg-background px-8 py-16 ">
            <Header />
            <View className="flex-row  mt-6 mb-2">
                {
                    weekDays.map((weekDay, i) => {
                        return(
                        <Text 
                            key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1 "
                            style={{width:daySize}}
                        >{weekDay}
                        </Text>
                        )
                    })
                }
            </View>
            <ScrollView showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom:50}}
            >    
            {
                summary && 
                <View className="flex-row flex-wrap">
                    {
                        datesFromYearsStart.map(date => {
                            const dayWithHabit = summary.find(day => {
                                return dayjs(date).isSame(day.date,'day')
                            })

                                return(
                                <HabitDay
                                    key={date.toISOString()}
                                    date={date}
                                    amountCompleted={dayWithHabit?.completed}
                                    amountOfhabits={dayWithHabit?.amount}
                                    onPress = {() => navigate('habit',{date:date.toISOString()})}
                                />
                                )
                        })
                    }
                    {
                        amountOfDaysToFill > 0 && Array.from({length:amountOfDaysToFill}).map( (_,index) => {
                                return(
                                    <View
                                    key={index}
                                    className="bg-zinc-900 border-2 rounded-lg m-1 border-zinc-800 opacity-40"
                                    style={{width:daySize, height: daySize}}
                                />
                                )
                            }
                        )
                    }
                </View>
            }
            </ScrollView>
        </View>
    )
}