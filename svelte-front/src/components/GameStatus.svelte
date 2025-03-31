<script>
  // Define props that will be passed to this component
  export let status = '';
  export let pgn = '';
</script>

<div class="game-status">
  <div class="status-container">
    <label for="status-display">Status:</label>
    <div id="status-display">{status}</div>
  </div>
  <div class="pgn-container">
    <label for="pgn-display">PGN:</label>
    <div id="pgn-display">{pgn}</div>
  </div>
</div>

<style>
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
</style>