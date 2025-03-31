<script>
    import { page } from '../stores/page';
    
    function goHome() {
      window.location.href = '/';
    }
  </script>
  
  <header>
    <h1>
      <a href="/" on:click|preventDefault={goHome}>
        <span class="chess">Chess</span><span class="beef">Beef</span>.com
      </a>
    </h1>
    
    {#if $page === 'home'}
      <p class="tagline">Got chess beef? Settle it here.</p>
    {:else if $page === 'game'}
      <p class="tagline">Settling the beef now...</p>
    {/if}
  </header>
  
  <style>
    header {
      margin-top: 50px;
      margin-bottom: 20px;
      text-align: center;
    }
    
    h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    
    h1 a {
      text-decoration: none;
      color: inherit;
    }
    
    .chess {
      color: green;
    }
    
    .beef {
      color: red;
    }
    
    .tagline {
      font-size: 1.5em;
      margin-top: 10px;
      margin-bottom: 20px;
    }
  </style>