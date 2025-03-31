<script>
    import { onMount } from 'svelte';
    import { initializeBoard } from '../services/chess';
    
    let codeInput = '';
    let errorMessage = '';
    let staticBoard;
    
    function createGame() {
      if (!codeInput.trim()) {
        errorMessage = 'Please enter a game code';
        return;
      }
      window.location.href = `/white?code=${codeInput}`;
    }
    
    function joinGame() {
      if (!codeInput.trim()) {
        errorMessage = 'Please enter a game code';
        return;
      }
      window.location.href = `/black?code=${codeInput}`;
    }
    
    onMount(() => {
      // Check for error parameter
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('error') === 'invalidCode') {
        errorMessage = 'Invalid invite code';
      }
      
      // Initialize the static board
      staticBoard = initializeBoard('staticBoard', {
        position: 'start',
        showNotation: true,
        draggable: false,
        pieceTheme: '/public/img/chesspieces/wikipedia/{piece}.png'
      });
      
      return () => {
        // Cleanup if needed
        if (staticBoard) {
          staticBoard.destroy();
        }
      };
    });
  </script>
  
  <div class="board-container">
    <!-- Static demonstration board -->
    <div id="staticBoard" style="width: 400px"></div>
  </div>
  
  <div id="game-setup">
    <h2>Game Setup</h2>
    <p>Enter a code to create or join a game</p>
    
    <div class="input-container">
      <input 
        type="text" 
        bind:value={codeInput} 
        placeholder="Enter game code"
        id="codeInput"
      >
    </div>
    
    <div class="button-container">
      <button on:click={createGame}>Create Game</button>
      <button on:click={joinGame}>Join Game</button>
    </div>
    
    {#if errorMessage}
      <div class="error-message">{errorMessage}</div>
    {/if}
  </div>
  
  <style>
    .board-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    
    #game-setup {
      max-width: 500px;
      padding: 20px;
      background-color: #f8f8f8;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    h2 {
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    .input-container {
      margin: 15px 0;
    }
    
    input {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    .button-container {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 15px;
    }
    
    button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px 15px;
      font-size: 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #45a049;
    }
    
    .error-message {
      color: red;
      margin-top: 15px;
      font-weight: bold;
    }
  </style>