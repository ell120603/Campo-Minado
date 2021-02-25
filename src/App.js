import React, { Component } from 'react'
import { StyleSheet,  View, Text, Alert} from 'react-native'
import params from './params'
import Flag from './componentes/Flag'
import MineField from './componentes/MineField'
import Header from './componentes/Header'
import LevelSelection from './screens/LevelSelection'
import {
    createMinedBoard,
    cloneBoard,
    hadExplosion,
    openField,
    wonGame,
    showMines,
    invertFlag,
    flagsUsed
} from './Functions'
export default class App extends Component{
    constructor(props) {
        super(props)
        this.state = this.createState()
      }
      minesAmount = () => {
        const cols = params.getColumnsAmount()
        const rows = params.getRowsAmount()
        return Math.ceil(cols * rows * params.difficultLevel)
      }
    createState= () =>{
        const cols = params.getColumnsAmount()
        const rows = params.getRowsAmount()
        return{
            board : createMinedBoard(rows, cols, this.minesAmount()),
            won: false,
            lost: false,
            showLeaveSelection:false,
        }  
    }
    onOpenField = (row, column) => {    
        const board = cloneBoard(this.state.board)
        openField(board,row, column)
        const lost = hadExplosion(board)
        const won = wonGame(board)
        if(lost){
            showMines(board)
            Alert.alert('game over', 'Vamos de next')
        }
        if(won){
            Alert.alert('Parabéns', 'Você venceu')
        }
        this.setState({ board, lost, won})
    }
    onSelectField=(row, column) => {
        const board = cloneBoard(this.state.board)
        invertFlag(board, row, column)
        const won = wonGame(board)
        if(won){
            Alert.alert('parabens', 'voce ganhou')

        }
    }
    onLevelSelected = level => {
        params.difficultLevel = level
        this.setState(this.createState())
    }
   
    render() {
        return (
            <View style={styles.container}>
            <LevelSelection isVisible={this.state.showLevelSelection}
          onLevelSelected={this.onLevelSelected}
          onCancel={() => this.setState({ showLevelSelection: false })} />
                <Header flagsLeft={this.minesAmount()- flagsUsed(this.state.board)} 
                onNewGame={()=> this.setState(this.createState())}/>
                <View style={styles.board}>
          <MineField board={this.state.board}  
          onOpenField={this.onOpenField}
          onSelectField={this.onSelectField}/>
        </View>
            </View>
        )
        }

}
const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#F5FCFF'
    },
    welcome:{
        fontSize:20,
        textAlign:'center',
        margin:10,

    },
    board:{
        alignItems: 'center',
        backgroundColor: '#AAA',

    },
})

