import './App.css'
import { GameScreen} from "./constants/gameScreens.js";
import GameArena from "./components/screens/game-arena.jsx";
import StartScreen from "./components/screens/StartScreen.jsx";
import { useGame } from "./hooks/useGame.js"
import AvatarSelectionScreen from "./components/screens/AvatarSelectionScreen.jsx";
import GameOverScreen from "./components/screens/GameOverScreen.jsx";
import CreatorsScreen from "./components/screens/CreatorsScreen.jsx";

function App() {
const { currentScreen } = useGame()
  return (
    <>
        {currentScreen === GameScreen.START && <StartScreen />}
        {currentScreen === GameScreen.AVATAR_SELECTION && <AvatarSelectionScreen />}
        {currentScreen === GameScreen.GAME_ARENA && <GameArena />}
        {currentScreen === GameScreen.GAME_OVER && <GameOverScreen />}
        {currentScreen === GameScreen.CREATORS && <CreatorsScreen />}
    </>
  )
}

export default App
