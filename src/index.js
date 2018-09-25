import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function calwinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i].slice();
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return [null, null];
}

function isDraw(squares) {
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) return false;
  }
  return !calwinner(squares)[0];
}

function callocation(location) {
  return [Math.floor(location % 3 + 1), Math.floor(location / 3 + 1)];
}

function Square(props) {
  return props.isWinDot ? (
    <button
      className="square"
      style={{ color: "red" }}
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  ) : (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinDot={
          this.props.winLine &&
          (i === this.props.winLine[0] ||
            i === this.props.winLine[1] ||
            i === this.props.winLine[2])
        }
      />
    );
  }

  render() {
    let rows = [];
    let cells = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        cells = cells.concat([this.renderSquare(3 * i + j)]);
      }
      rows = rows.concat([<div className="board-row">{cells}</div>]);
      cells = cells.slice(0, 0);
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: null
        }
      ],
      stepNum: 0,
      selectedStep: 0,
      xIsNext: true,
      ascending: true
    };
  }

  jumpTo(step) {
    this.setState({
      stepNum: step,
      selectedStep: step,
      xIsNext: step % 2 === 0
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNum + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (squares[i] || calwinner(squares)[0]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: i
        }
      ]),
      stepNum: history.length,
      selectedStep: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  orderClick() {
    const ascending = this.state.ascending;
    this.setState({
      ascending: !ascending
    });
  }

  render() {
    const history = this.state.history.slice();
    const current = history[this.state.stepNum];
    const squares = current.squares.slice();
    const winner = calwinner(squares)[0];
    const winLine = calwinner(squares)[1];

    const status = winner
      ? `Winner: ${winner}`
      : isDraw(squares)
        ? `Game draws`
        : `Next player: ${this.state.xIsNext ? "X" : "O"}`;

    const moves = history.map((step, move) => {
      const des = move
        ? `Go to move #${move}. Location: 
        (${callocation(step.location)[0]}, ${callocation(step.location)[1]})`
        : `Go to game start`;
      return this.state.selectedStep === move ? (
        <li
          key={move}
          style={{ "font-weight": "bold", color: "blue" }}
          onClick={() => this.jumpTo(move)}
        >
          <button style={{ "font-weight": "bold", color: "blue" }}>
            {des}
          </button>
        </li>
      ) : (
        <li key={move} onClick={() => this.jumpTo(move)}>
          <button>{des}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winLine={winLine}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.orderClick()}>Order</button>
          {this.state.ascending ? <ol>{moves}</ol> : <ol>{moves.reverse()}</ol>}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
