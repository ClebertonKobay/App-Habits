import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";

export function HabitEmpty(){
    const { navigate } = useNavigation()

    return(
            <Text 
                className="text-zinc-400 text-base"
            >
                Você ainda não esta monitorando nenhum hábito {' '}
                <Text
                    className="text-violet-400 text-base underline active:text-violet-600"
                    onPress={()=> navigate('new')}
                >
                    Comece cadastrando um.
                </Text>

            </Text>

    )
}