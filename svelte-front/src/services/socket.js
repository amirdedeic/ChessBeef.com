import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.handlers = {
      startGame: null,
      newMove: null,
      gameOverDisconnect: null
    };
  }
  
  init() {
    if (this.connected) return;
    
    // Initialize socket connection
    this.socket = io();
    this.connected = true;
    
    // Set up event listeners
    this.socket.on('startGame', () => {
      if (this.handlers.startGame) {
        this.handlers.startGame();
      }
    });
    
    this.socket.on('newMove', (move) => {
      if (this.handlers.newMove) {
        this.handlers.newMove(move);
      }
    });
    
    this.socket.on('gameOverDisconnect', () => {
      if (this.handlers.gameOverDisconnect) {
        this.handlers.gameOverDisconnect();
      }
    });
    
    console.log('Socket service initialized');
  }
  
  // Register event handlers
  onStartGame(callback) {
    this.handlers.startGame = callback;
  }
  
  onNewMove(callback) {
    this.handlers.newMove = callback;
  }
  
  onGameOverDisconnect(callback) {
    this.handlers.gameOverDisconnect = callback;
  }
  
  // Emit events
  joinGame(data) {
    if (!this.connected) return;
    this.socket.emit('joinGame', data);
  }
  
  sendMove(move) {
    if (!this.connected) return;
    this.socket.emit('move', move);
  }
  
  // Clean up resources
  cleanup() {
    if (!this.connected) return;
    
    this.socket.off('startGame');
    this.socket.off('newMove');
    this.socket.off('gameOverDisconnect');
    
    this.handlers = {
      startGame: null,
      newMove: null,
      gameOverDisconnect: null
    };
  }
}

// Export as a singleton
export const socketService = new SocketService();