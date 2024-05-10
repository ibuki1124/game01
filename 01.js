const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 盤面の描画
function drawBoard() {
  if (canvas.getContext){
    let rectangle = new Path2D();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++){
        rectangle.rect(j * 100, i * 100, 100, 100);
      }
    }
    ctx.stroke(rectangle);
  }
}

// 〇✖の描画
function drawMark(x, y, mark) {
  if (mark == "circle"){
    ctx.beginPath();
    ctx.arc(x * 100 + 50, y * 100 + 50, 30, 0, 2 * Math.PI);
    ctx.stroke();
  }else if (mark == "cross"){
    ctx.beginPath();
    // 斜めの線を引く
    ctx.moveTo(x * 100 + 20, y * 100 + 20);
    ctx.lineTo(x * 100 + 80, y * 100 + 80);
    ctx.stroke();

    ctx.beginPath();
    // 逆方向の斜めの線を引く
    ctx.moveTo(x * 100 + 20, y * 100 + 80);
    ctx.lineTo(x * 100 + 80, y * 100 + 20);
    ctx.stroke();
  }
}

// ゲームの状態
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];
let currentPlayer = 'circle'; // 先攻は〇
let isGameStarted = false; // ゲーム開始フラグ

// 開始ボタン
document.getElementById('start').addEventListener('click', startGame);
function startGame() {
  alert("ゲームを開始します");
  // 開始ボタン無効化
  document.getElementById('start').disabled = true;

  // ゲーム開始フラグを立てる
  isGameStarted = true;
}

// 盤面クリック時の描画
canvas.addEventListener('click', (event) => {
  if (isGameStarted == false) {
      return; // ゲーム未開始時は無効
  }

  const x = Math.floor(event.offsetX / 100);
  const y = Math.floor(event.offsetY / 100);

  // ゲーム終了時はクリック無効
  if (isGameOver()) {
    return;
  }

  if (board[y][x] === '') {
    board[y][x] = currentPlayer;
    drawMark(x, y, currentPlayer);

    // 勝利判定
    if (checkWinner(currentPlayer)) {
      if (currentPlayer == "circle"){
        alert(`〇の勝ちです！`);
      }else if (currentPlayer == "cross"){
        alert(`☓の勝ちです！`);
      }
      disableClick(); // ゲーム終了後、クリックを無効化
    } else if (isDraw()) {
      alert('引き分けです！');
      disableClick(); // ゲーム終了後、クリックを無効化
    } else {
      currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    }
  }
});

// ゲーム終了判定
function isGameOver() {
  return checkWinner(currentPlayer) || isDraw();
}

// クリック無効化
function disableClick() {
  canvas.removeEventListener('click', canvas.onclick);
}

// 勝利判定
function checkWinner(player) {
  // 横方向のチェック
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
      return true;
    }
  }

  // 縦方向のチェック
  for (let i = 0; i < 3; i++) {
    if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
      return true;
    }
  }

  // 斜め方向のチェック
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
    return true;
  }
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
    return true;
  }

  return false;
}

// 引き分け判定
function isDraw() {
  // すべてのマスにマークが置かれているかどうかを確認
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') {
        return false; // 空白マスがあれば、まだゲーム終了ではない
      }
    }
  }
  return true;
}

// 終了ボタン
document.getElementById("reset").addEventListener("click", resetGame);
function resetGame() {
  let Com = confirm('ゲームをリセットしますか？');

  if (Com == true){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // board 配列を初期化
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[i][j] = '';
      }
    }

    // currentPlayer 変数を初期化（先攻：〇にする）
    currentPlayer = 'circle';

    // 盤面を再描画
    drawBoard();

    // 開始ボタン有効化
    document.getElementById('start').disabled = false;

    // ゲーム開始フラグを解除
    isGameStarted = false;
  }
}