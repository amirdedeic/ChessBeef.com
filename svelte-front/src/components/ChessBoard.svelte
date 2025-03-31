<script>
    import { onMount, onDestroy } from 'svelte';
    import { socketService } from '../services/socket';
    import { initializeBoard } from '../services/chess';
    
    let board;
    let game;
    let playerColor;
    let status = '';
    let pgn = '';
    let gameHasStarted = false;
    let gameOver = false;
    
    function updateStatus() {
      let moveColor = 'White';
      if (game.turn() === 'b') {
        moveColor = 'Black';
      }
  
      // checkmate?
      if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
      }
      // draw?
      else if (game.in_draw()) {
        status = 'Game over, drawn position';
      }
      // opponent disconnected
      else if (gameOver) {
        status = 'Opponent disconnected, you win!';
      }
      // waiting for opponent
      else if (!gameHasStarted) {
        status = 'Waiting for opponent to join';
      }
      // game still on
      else {
        status = moveColor + ' to move';
        // check?
        if (game.in_check()) {
          status += ', ' + moveColor + ' is in check';
        }
      }
  
      pgn = game.pgn();
    }
    
    onMount(() => {
      // Get player color from URL
      const pathname = window.location.pathname;
      playerColor = pathname === '/white' ? 'white' : 'black';
      
      // Initialize Chess.js instance
      game = new Chess();
      
      // Initialize socket connection and handlers
      socketService.init();
      
      socketService.onStartGame(() => {
        gameHasStarted = true;
        updateStatus();
      });
      
      socketService.onNewMove((move) => {
        game.move(move);
        board.position(game.fen());
        updateStatus();
      });
      
      socketService.onGameOverDisconnect(() => {
        gameOver = true;
        updateStatus();
      });
      
      // Join the game using the code from URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        socketService.joinGame({ code });
      }
      
      // Define chess board functions
      const onDragStart = (source, piece, position, orientation) => {
        // Do not pick up pieces if the game is over or hasn't started
        if (game.game_over()) return false;
        if (!gameHasStarted) return false;
        if (gameOver) return false;
        
        // Only allow the current player to move their pieces
        if ((playerColor === 'black' && piece.search(/^w/) !== -1) || 
            (playerColor === 'white' && piece.search(/^b/) !== -1)) {
          return false;
        }
        
        // Only pick up pieces for the side to move
        if ((game.turn() === 'w' && piece.search(/^b/) !== -1) || 
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
          return false;
        }
      };
      
      const onDrop = (source, target) => {
        let theMove = {
          from: source,
          to: target,
          promotion: 'q' // Always promote to a queen for simplicity
        };
        
        // See if the move is legal
        const move = game.move(theMove);
        
        // Illegal move
        if (move === null) return 'snapback';
        
        // Send move to opponent
        socketService.sendMove(theMove);
        
        updateStatus();
      };
      
      const onSnapEnd = () => {
        board.position(game.fen());
      };
      
      // Initialize the chessboard
      board = initializeBoard('chessBoard', {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        pieceTheme: '/public/img/chesspieces/wikipedia/{piece}.png'
      });
      
      // Flip board for black player
      if (playerColor === 'black') {
        board.flip();
      }
      
      updateStatus();
      
      return () => {
        // Clean up
        if (board) {
          board.destroy();
        }
      };
    });
    
    onDestroy(() => {
      // Clean up socket listeners
      socketService.cleanup();
    });
  </script>
  
  <div class="game-container">
    <div class="game-info">
      <h2>Playing as {playerColor}</h2>
    </div>
    
    <div id="chessBoard" style="width: 600px"></div>
    
    <div class="game-status">
      <div class="status-container">
        <label>Status:</label>
        <div id="status">{status}</div>
      </div>
      <div class="pgn-container">
        <label>PGN:</label>
        <div id="pgn">{pgn}</div>
      </div>
    </div>
    
    <button class="return-button" on:click={() => window.location.href = '/'}>
      Return to Home
    </button>
  </div>
  
  <style>
    .game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 800px;
    }
    
    .game-info {
      margin-bottom: 20px;
      width: 100%;
      text-align: center;
    }
    
    .game-status {
      margin-top: 20px;
      width: 100%;
      max-width: 600px;
    }
    
    .status-container, .pgn-container {
      margin: 10px 0;
      padding: 10px;
      background-color: #f8f8f8;
      border-radius: 4px;
      text-align: left;
    }
    
    label {
      font-weight: bold;
      display: block;
      margin-bottom: 5px;
    }
    
    .return-button {
      margin-top: 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    
    .return-button:hover {
      background-color: #45a049;
    }
  </style>