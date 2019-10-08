import React from "react";
import gql from "graphql-tag";
import { Mutation, withApollo } from "react-apollo";
import { gameInitQuery } from "./Board";

const clickTileMutation = gql`
  mutation clickOnTile($x: Int!, $y: Int!) {
    clickOnTile(x: $x, y: $y) {
      board {
        colsAndRows
        locked {
          x
          y
        }
      }
      dupeRow
      dupeCol
    }
  }
`;

function Square(props) {
  const { value, dupe, locked } = props;
  const style = () => {
    let className = ["square"];
    if (locked) className.push("locked");
    if (dupe) className.push("dupe");
    className.push(`fill-${value || 0}`);
    return className.join(" ");
  };
  const { x, y } = props.coords;
  console.log("rendering");
  return (
    <Mutation
      mutation={clickTileMutation}
      update={(
        cache,
        {
          data: {
            clickOnTile: { board, dupeCol, dupeRow }
          }
        }
      ) => {
        const localCache = cache.readQuery({
          query: gameInitQuery,
          variables: { size: 6 }
        });
        //Deep clone of cache object
        let data = JSON.parse(JSON.stringify(localCache));
        data.boardInit.colsAndRows[y][x] = board.colsAndRows[y][x];
        data.dupeRow = dupeRow;
        data.dupeCol = dupeCol;
        cache.writeQuery({
          query: gameInitQuery,
          variables: { size: 6 },
          data
        });
      }}
    >
      {clickOnTile => (
        <span
          onClick={() => {
            if(!locked)
            clickOnTile({ variables: { x, y } })}}
          className={style()}
        ></span>
      )}
    </Mutation>
  );
}

export default withApollo(Square);
