/**
 * This service wraps the chess.js and chessboard.js libraries
 * to make them easier to use in a Svelte context
 */

// This assumes Chess and Chessboard objects are available globally via script tags
export function initializeBoard(elementId, config) {
    // Make sure the libraries are loaded
    if (typeof Chessboard !== 'function') {
      console.error('Chessboard.js is not loaded');
      return null;
    }
    
    return Chessboard(elementId, config);
  }
  
  export function createChessGame() {
    // Make sure the libraries are loaded
    if (typeof Chess !== 'function') {
      console.error('Chess.js is not loaded');
      return null;
    }
    
    return new Chess();
  }