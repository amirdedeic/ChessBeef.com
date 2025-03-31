<script>
  import { onMount } from 'svelte';
  import { page } from './stores/page';
  import ChessBoard from './components/ChessBoard.svelte';
  import GameSetup from './components/GameSetup.svelte';
  import Header from './components/Header.svelte';
  
  let currentPage;
  
  // Subscribe to page store
  page.subscribe(value => {
    currentPage = value;
  });
  
  onMount(() => {
    // Check URL parameters to determine if we're joining a game
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const color = urlParams.get('color');
    
    if (code && (window.location.pathname === '/white' || window.location.pathname === '/black')) {
      page.set('game');
    } else {
      page.set('home');
    }
  });
</script>

<Header />

<main>
  {#if currentPage === 'home'}
    <GameSetup />
  {:else if currentPage === 'game'}
    <ChessBoard />
  {/if}
</main>

<footer>
  <p>ChessBeef &copy; 2025</p>
</footer>

<style>
  main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  footer {
    position: fixed;
    bottom: 20px;
    width: 100%;
    font-size: 0.9em;
    color: #666;
    text-align: center;
  }
</style>
