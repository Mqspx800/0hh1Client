# 0hh1 game client
- 0hh1 game

## Game rules:
- Player can place red or green tiles on the board
- No more than 3 consecutive tiles to be the same color
- In the same column or row, number of each color of tiles should not exceed 50% of the column length(4 red in the same row of a 6x6 board is not allowed) 
- No 2 columns or rows should be identical
- If the board is filled 100%, game finished

## Technologies
- React
- Apollo client& graphQL

## Features(in progress)
- Game init with 25% tile placed
- All rule checker are implemnted
- Instant illustration if there are any tiles is breaking the rule

### In progress
- Display game progress
- Optimize game connection with websocket in subscription pattern

## Entry point
```
npm install
npm run start
```
- access at http://localhost:3000


