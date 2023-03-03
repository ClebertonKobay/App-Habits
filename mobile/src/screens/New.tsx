import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import { api } from "../lib/axios";


const avaibleWeekDays = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado']

export function New (){
    const [ weekDays, setWeekDays ] = useState<number[]>([])
    const [title, setTitle] = useState('');

    function handleToggleWeekDays(weekDayIndex : number){
        if(weekDays.includes(weekDayIndex)){
            setWeekDays(prevState => prevState.filter(weekDay => weekDay != weekDayIndex));
        }else {
            setWeekDays(prevState => [...prevState, weekDayIndex]);
        }
    }

    async function handleCreateNewhabit() {
        try{
            if(!title.trim() || weekDays.length === 0){
                Alert.alert("Criar Hábito","Informa o nome do hábito e escolha a periodicidade.")
            }
            await api.post('/habits',{
                title:title,
                weekDay:weekDays,
            });

            setTitle('');
            setWeekDays([]);
            Alert.alert("Criar Hábito","Hábito criado com sucesso.")
        }catch(error){
            console.error(error);
            Alert.alert("Ops","Não foi possivel criar o novo hábito.")
        }
    }

    return(
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom:50
                }}
            >
            <BackButton />

                <Text
                    className="mt-6 text-white font-extrabold text-3xl"
                >
                Criar Hábito
                </Text>
                <Text
                    className="mt-6 text-white font-semibold text-base"
                >
                Qual seu comprometimento?
                </Text>

                <TextInput 
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900  text-white border-2 border-zinc-800 focus:border-green-600"
                    placeholder="ex.: Exercícios, Beber 2L de água, etc..."
                    placeholderTextColor={colors.zinc[400]}
                    onChangeText={setTitle}
                    value={title}
                />
                <Text
                    className="text-white font-semibold mt-4 mb-3 text-base"
                >
                    Qual a  recorrência?
                </Text>
                {
                    avaibleWeekDays.map((weekDay, index)=>{
                        return(
                            <CheckBox 
                                key={weekDay} 
                                title={weekDay}
                                checked = {weekDays.includes(index)}
                                onPress = {() => handleToggleWeekDays(index)}
                            />
                        )
                    })
                }
                <TouchableOpacity
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                    activeOpacity={0.5}
                    onPress={handleCreateNewhabit}
                >
                    <Feather
                        name="check"
                        size={20}
                        color={colors.white}
                    />
                    <Text
                        className="font-base text-white font-semibold ml-2 "
                    >
                        Confirmar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
        
    )
}