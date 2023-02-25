import { View, Text, ScrollView } from "react-native";

import { generateDatesFromYearsBeginning } from '../utils/generate-dates-from-years-beginning';
import { HabitDay, daySize } from "../components/HabitDay";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";

const weekDays = ['D','S','T','Q','Q','S','S']

const datesFromYearsStart = generateDatesFromYearsBeginning();

const minimumSummaryDates = 18 * 5;
const amountOfDaysToFill = minimumSummaryDates - datesFromYearsStart.length;


export function Home(){

    const { navigate } = useNavigation();
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
                <View className="flex-row flex-wrap">
                    {
                        datesFromYearsStart.map(date => {
                            return(
                                <HabitDay
                                    key={date.toISOString()}
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
            </ScrollView>
        </View>
    )
}