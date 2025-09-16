<template>
  <div class="multiplayer-games">
    <div class="tool-header">
      <h2>多人小游戏合集</h2>
      <p>经典本地多人游戏，支持在同一设备上多人游玩</p>
    </div>

    <div class="games-container">
      <!-- 游戏选择界面 -->
      <div v-if="currentGame === null" class="game-selection">
        <h3>选择游戏</h3>
        <div class="game-grid">
          <div 
            v-for="game in games" 
            :key="game.id"
            class="game-card"
            @click="selectGame(game.id)"
          >
            <div class="game-icon">{{ game.icon }}</div>
            <h4>{{ game.name }}</h4>
            <p>{{ game.description }}</p>
            <div class="player-count">
              <span>👥 {{ game.minPlayers }}-{{ game.maxPlayers }}人</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 游戏界面 -->
      <div v-else class="game-interface">
        <div class="game-header">
          <button @click="backToSelection" class="back-btn">
            ← 返回游戏列表
          </button>
          <h3>{{ currentGameData.name }}</h3>
          <div class="game-controls">
            <button @click="resetGame" class="control-btn">重新开始</button>
            <button @click="showRules = !showRules" class="control-btn">
              游戏规则
            </button>
          </div>
        </div>

        <!-- 井字棋 -->
        <div v-if="currentGame === 'tic-tac-toe'" class="tic-tac-toe-game">
          <div class="player-turn">
            当前玩家: <span :class="`player-${currentPlayer}`">{{ players[currentPlayer - 1] }} ({{ currentPlayer === 1 ? '❌' : '⭕' }})</span>
          </div>
          
          <div class="score-board">
            <div class="score">玩家1 (❌): {{ scores.player1 }}</div>
            <div class="score">玩家2 (⭕): {{ scores.player2 }}</div>
            <div class="score">平局: {{ scores.draw }}</div>
          </div>
          
          <div class="board">
            <div 
              v-for="(cell, index) in board" 
              :key="index"
              class="cell"
              :class="{ filled: cell !== '' }"
              @click="makeMove(index)"
            >
              {{ cell === 1 ? '❌' : cell === 2 ? '⭕' : '' }}
            </div>
          </div>
          
          <div v-if="winner" class="game-result">
            <h3 v-if="winner === 'draw'">平局！</h3>
            <h3 v-else>玩家 {{ players[winner - 1] }} ({{ winner === 1 ? '❌' : '⭕' }}) 获胜！</h3>
            <button @click="resetBoard" class="play-again-btn">再玩一次</button>
          </div>
        </div>

        <!-- 五子棋 -->
        <div v-if="currentGame === 'gomoku'" class="gomoku-game">
          <div class="game-info">
            <div class="player-turn">
              当前玩家: <span :class="`player-${currentPlayer}`">{{ players[currentPlayer - 1] }} ({{ currentPlayer === 1 ? '⚫' : '⚪' }})</span>
            </div>
            
            <div class="score-board">
              <div class="score">玩家1 (⚫): {{ scores.player1 }}</div>
              <div class="score">玩家2 (⚪): {{ scores.player2 }}</div>
            </div>
          </div>
          
          <div class="gomoku-board">
            <div 
              v-for="(row, rowIndex) in gomokuBoard" 
              :key="rowIndex"
              class="board-row"
            >
              <div 
                v-for="(cell, colIndex) in row" 
                :key="colIndex"
                class="board-cell"
                :class="{ 
                  black: cell === 1, 
                  white: cell === 2,
                  last: lastMove && lastMove[0] === rowIndex && lastMove[1] === colIndex
                }"
                @click="placeStone(rowIndex, colIndex)"
              ></div>
            </div>
          </div>
          
          <div v-if="gomokuWinner" class="game-result">
            <h3>玩家 {{ players[gomokuWinner - 1] }} ({{ gomokuWinner === 1 ? '⚫' : '⚪' }}) 获胜！</h3>
            <button @click="resetGomoku" class="play-again-btn">再玩一次</button>
          </div>
        </div>

        <!-- 数字炸弹 -->
        <div v-if="currentGame === 'number-bomb'" class="number-bomb-game">
          <div class="bomb-setup" v-if="!bombGameActive">
            <h4>设置数字范围</h4>
            <div class="range-inputs">
              <div class="input-group">
                <label>最小值</label>
                <input type="number" v-model.number="minNumber" min="1" max="999">
              </div>
              <div class="input-group">
                <label>最大值</label>
                <input type="number" v-model.number="maxNumber" :min="minNumber + 10" max="1000">
              </div>
            </div>
            <button @click="startBombGame" class="start-btn">开始游戏</button>
          </div>
          
          <div v-else class="bomb-game">
            <div class="bomb-info">
              <div class="current-player">
                当前玩家: <span class="player-name">{{ players[currentPlayer - 1] }}</span>
              </div>
              <div class="range-display">
                数字范围: {{ currentMin }} - {{ currentMax }}
              </div>
            </div>
            
            <div class="bomb-input">
              <input 
                type="number" 
                v-model.number="playerGuess" 
                :min="currentMin" 
                :max="currentMax"
                placeholder="输入猜测的数字"
                @keyup.enter="submitGuess"
              >
              <button @click="submitGuess" :disabled="!playerGuess">确认</button>
            </div>
            
            <div class="bomb-result" v-if="bombGameOver">
              <h3>{{ bombGameOver === 'bomb' ? '💥 炸弹爆炸！' : `玩家 ${players[currentPlayer - 1]} 安全` }}</h3>
              <div class="bomb-number" v-if="bombGameOver === 'bomb'">
                炸弹数字是: {{ bombNumber }}
              </div>
              <button @click="resetBombGame" class="play-again-btn">再玩一次</button>
            </div>
          </div>
        </div>

        <!-- 游戏规则弹窗 -->
        <div v-if="showRules" class="rules-modal">
          <div class="rules-content">
            <h4>{{ currentGameData.name }} - 游戏规则</h4>
            <div class="rules-text" v-html="currentGameData.rules"></div>
            <button @click="showRules = false" class="close-btn">关闭</button>
          </div>
        </div>
      </div>

      <!-- 玩家设置 -->
      <div v-if="currentGame !== null" class="player-setup">
        <h4>玩家设置</h4>
        <div class="player-inputs">
          <div 
            v-for="(player, index) in players" 
            :key="index"
            class="player-input"
          >
            <label>玩家 {{ index + 1 }} 名称</label>
            <input 
              type="text" 
              v-model="players[index]" 
              :placeholder="`玩家 ${index + 1}`"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultiplayerGames',
  data() {
    return {
      currentGame: null,
      showRules: false,
      players: ['玩家1', '玩家2'],
      
      // 井字棋数据
      board: Array(9).fill(''),
      currentPlayer: 1,
      winner: null,
      scores: {
        player1: 0,
        player2: 0,
        draw: 0
      },
      
      // 五子棋数据
      gomokuBoard: Array(15).fill().map(() => Array(15).fill(0)),
      gomokuWinner: null,
      lastMove: null,
      
      // 数字炸弹数据
      minNumber: 1,
      maxNumber: 100,
      bombNumber: null,
      playerGuess: null,
      currentMin: 1,
      currentMax: 100,
      bombGameActive: false,
      bombGameOver: null,
      
      // 游戏列表
      games: [
        {
          id: 'tic-tac-toe',
          name: '井字棋',
          icon: '❌⭕',
          description: '经典的三连棋游戏，两名玩家轮流在3x3棋盘上放置标记',
          minPlayers: 2,
          maxPlayers: 2,
          rules: `两名玩家轮流在3x3的棋盘上放置自己的标记(❌或⭕)<br>
                  率先将三个标记连成一条直线(横、竖或斜)的玩家获胜<br>
                  如果棋盘填满但没有玩家获胜，则为平局`
        },
        {
          id: 'gomoku',
          name: '五子棋',
          icon: '⚫⚪',
          description: '在15x15棋盘上争夺五子连珠，策略性更强的棋类游戏',
          minPlayers: 2,
          maxPlayers: 2,
          rules: `两名玩家轮流在15x15的棋盘上放置黑色(⚫)或白色(⚪)棋子<br>
                  率先将五个同色棋子连成一条直线(横、竖或斜)的玩家获胜<br>
                  棋盘无限大，没有边界限制`
        },
        {
          id: 'number-bomb',
          name: '数字炸弹',
          icon: '💣',
          description: '猜数字游戏，猜中炸弹数字的玩家出局，最后留下的玩家获胜',
          minPlayers: 2,
          maxPlayers: 6,
          rules: `系统会在指定范围内随机选择一个数字作为"炸弹"<br>
                  玩家轮流猜测数字，系统会告知炸弹在猜测数字的左边还是右边<br>
                  猜中炸弹数字的玩家出局，游戏继续直到只剩一名玩家<br>
                  最后留下的玩家获胜`
        }
      ]
    };
  },
  computed: {
    currentGameData() {
      return this.games.find(game => game.id === this.currentGame) || {};
    }
  },
  methods: {
    selectGame(gameId) {
      this.currentGame = gameId;
      this.resetGame();
    },
    
    backToSelection() {
      this.currentGame = null;
      this.showRules = false;
    },
    
    resetGame() {
      if (this.currentGame === 'tic-tac-toe') {
        this.resetBoard();
      } else if (this.currentGame === 'gomoku') {
        this.resetGomoku();
      } else if (this.currentGame === 'number-bomb') {
        this.resetBombGame();
      }
    },
    
    // 井字棋方法
    makeMove(index) {
      if (this.board[index] !== '' || this.winner) return;
      
      this.board[index] = this.currentPlayer;
      
      if (this.checkWin()) {
        this.winner = this.currentPlayer;
        this.scores[`player${this.currentPlayer}`]++;
      } else if (this.board.every(cell => cell !== '')) {
        this.winner = 'draw';
        this.scores.draw++;
      } else {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
      }
    },
    
    checkWin() {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // 行
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // 列
        [0, 4, 8], [2, 4, 6]             // 对角线
      ];
      
      return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return this.board[a] !== '' && 
               this.board[a] === this.board[b] && 
               this.board[a] === this.board[c];
      });
    },
    
    resetBoard() {
      this.board = Array(9).fill('');
      this.currentPlayer = 1;
      this.winner = null;
    },
    
    // 五子棋方法
    placeStone(row, col) {
      if (this.gomokuBoard[row][col] !== 0 || this.gomokuWinner) return;
      
      this.gomokuBoard[row][col] = this.currentPlayer;
      this.lastMove = [row, col];
      
      if (this.checkGomokuWin(row, col)) {
        this.gomokuWinner = this.currentPlayer;
        this.scores[`player${this.currentPlayer}`]++;
      } else {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
      }
    },
    
    checkGomokuWin(row, col) {
      const directions = [
        [0, 1],  // 水平
        [1, 0],  // 垂直
        [1, 1],  // 对角线
        [1, -1]  // 反对角线
      ];
      
      const player = this.gomokuBoard[row][col];
      
      for (const [dx, dy] of directions) {
        let count = 1;
        
        // 正向检查
        for (let i = 1; i < 5; i++) {
          const newRow = row + dx * i;
          const newCol = col + dy * i;
          
          if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15 || 
              this.gomokuBoard[newRow][newCol] !== player) {
            break;
          }
          
          count++;
        }
        
        // 反向检查
        for (let i = 1; i < 5; i++) {
          const newRow = row - dx * i;
          const newCol = col - dy * i;
          
          if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15 || 
              this.gomokuBoard[newRow][newCol] !== player) {
            break;
          }
          
          count++;
        }
        
        if (count >= 5) return true;
      }
      
      return false;
    },
    
    resetGomoku() {
      this.gomokuBoard = Array(15).fill().map(() => Array(15).fill(0));
      this.currentPlayer = 1;
      this.gomokuWinner = null;
      this.lastMove = null;
    },
    
    // 数字炸弹方法
    startBombGame() {
      this.bombNumber = Math.floor(Math.random() * (this.maxNumber - this.minNumber + 1)) + this.minNumber;
      this.currentMin = this.minNumber;
      this.currentMax = this.maxNumber;
      this.bombGameActive = true;
      this.bombGameOver = null;
      this.playerGuess = null;
      this.currentPlayer = 1;
    },
    
    submitGuess() {
      if (!this.playerGuess || this.playerGuess < this.currentMin || this.playerGuess > this.currentMax) {
        return;
      }
      
      if (this.playerGuess === this.bombNumber) {
        this.bombGameOver = 'bomb';
        return;
      }
      
      if (this.playerGuess < this.bombNumber) {
        this.currentMin = this.playerGuess + 1;
      } else {
        this.currentMax = this.playerGuess - 1;
      }
      
      this.playerGuess = null;
      
      // 切换到下一个玩家
      this.currentPlayer = this.currentPlayer % this.players.length + 1;
      
      // 检查游戏是否结束（只剩一个数字）
      if (this.currentMin === this.currentMax) {
        this.bombGameOver = 'safe';
      }
    },
    
    resetBombGame() {
      this.bombGameActive = false;
      this.bombGameOver = null;
      this.playerGuess = null;
    }
  }
};
</script>

<style scoped>
.multiplayer-games {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.tool-header {
  text-align: center;
  margin-bottom: 30px;
}

.tool-header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.tool-header p {
  color: #7f8c8d;
  font-size: 1.1em;
}

.games-container {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-selection h3 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.game-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.game-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.game-card h4 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.game-card p {
  color: #7f8c8d;
  font-size: 0.9em;
  margin-bottom: 15px;
}

.player-count {
  color: #95a5a6;
  font-size: 0.85em;
}

.game-interface {
  margin-bottom: 20px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.back-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.game-header h3 {
  color: #2c3e50;
  margin: 0;
}

.game-controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  color: #495057;
}

.control-btn:hover {
  background-color: #e9ecef;
}

/* 井字棋样式 */
.tic-tac-toe-game {
  text-align: center;
}

.player-turn {
  font-size: 1.2em;
  margin-bottom: 15px;
}

.player-1 {
  color: #e74c3c;
  font-weight: bold;
}

.player-2 {
  color: #3498db;
  font-weight: bold;
}

.score-board {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.score {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 80px);
  grid-template-rows: repeat(3, 80px);
  gap: 5px;
  margin: 0 auto 20px;
  max-width: 250px;
}

.cell {
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.cell:hover:not(.filled) {
  background-color: #e9ecef;
}

.cell.filled {
  cursor: not-allowed;
}

.game-result {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.play-again-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.play-again-btn:hover {
  background-color: #218838;
}

/* 五子棋样式 */
.gomoku-game {
  text-align: center;
}

.gomoku-board {
  display: inline-block;
  border: 2px solid #2c3e50;
  margin: 0 auto 20px;
  background-color: #d4b483;
}

.board-row {
  display: flex;
}

.board-cell {
  width: 30px;
  height: 30px;
  border: 1px solid #8b5a2b;
  position: relative;
  cursor: pointer;
}

.board-cell:hover:not(.black):not(.white) {
  background-color: rgba(255, 255, 255, 0.3);
}

.board-cell.black {
  background-color: #000;
  border-radius: 50%;
}

.board-cell.white {
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #000;
}

.board-cell.last::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

/* 数字炸弹样式 */
.number-bomb-game {
  text-align: center;
}

.bomb-setup {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

.range-inputs {
  display: flex;
  gap: 15px;
  margin: 15px 0;
  justify-content: center;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c3e50;
}

.input-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.start-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.bomb-game {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

.bomb-info {
  margin-bottom: 20px;
}

.current-player {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.player-name {
  font-weight: bold;
  color: #e74c3c;
}

.range-display {
  font-size: 1.1em;
  color: #2c3e50;
}

.bomb-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.bomb-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1.1em;
}

.bomb-input button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.bomb-input button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.bomb-result {
  margin-top: 20px;
}

.bomb-number {
  font-size: 1.2em;
  margin: 10px 0;
  color: #e74c3c;
  font-weight: bold;
}

/* 游戏规则弹窗 */
.rules-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.rules-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.rules-content h4 {
  margin-top: 0;
  color: #2c3e50;
}

.rules-text {
  margin: 20px 0;
  line-height: 1.6;
}

.close-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

/* 玩家设置 */
.player-setup {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.player-setup h4 {
  margin-top: 0;
  color: #2c3e50;
}

.player-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.player-input {
  display: flex;
  flex-direction: column;
}

.player-input label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c3e50;
}

.player-input input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .game-grid {
    grid-template-columns: 1fr;
  }
  
  .game-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .board {
    grid-template-columns: repeat(3, 60px);
    grid-template-rows: repeat(3, 60px);
  }
  
  .board-cell {
    width: 20px;
    height: 20px;
  }
  
  .range-inputs {
    flex-direction: column;
  }
}
</style>