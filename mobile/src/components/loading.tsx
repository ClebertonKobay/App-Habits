import { ActivityIndicator, StyleSheet,View,Text } from "react-native";

export function Loading(){
    return(<View style={styles.loadingView}>
        <ActivityIndicator size={20} color="#4C1D95"/>
        <Text style={styles.text}>Loading</Text>
    </View>);
}

const styles = StyleSheet.create({
    loadingView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#09090A"
    },
    text:{
        color:"#fff",
        fontSize:25,
    }
});