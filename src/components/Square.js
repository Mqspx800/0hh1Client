import React from "react";
import gql from "graphql-tag";
import { Mutation, withApollo } from "react-apollo";
// import { GAMEQUERY } from "./Board";

const clickTileMutation = gql`
  mutation clickOnTile($x: Int!, $y: Int!) {
    clickOnTile(x: $x, y: $y) {
      board {
        colsAndRows
      }
      dupeRow
      dupeCol
      sessionID
      culpritsCoords {
        x
        y
      }
    }
  }
`;

function Square(props) {
  const { value, dupe, locked, error, sessionID } = props;
  const style = () => {
    let className = ["square"];
    if (locked) className.push("locked");
    if (dupe) className.push("dupe");
    className.push(`fill-${value || 0}`);
    if (error) className.push(`error`);
    return className.join(" ");
  };
  const { x, y } = props.coords;
  return (
    <Mutation
      mutation={clickTileMutation}
      update={(
        cache,
        {
          data: {
            clickOnTile: { board, dupeCol, dupeRow, culpritsCoords }
          }
        }
      ) => {
        // const localCache = cache.readFragment({
        //   id:sessionID,
        //   fragment:gql`
        //     fragment bo on board{
        //       sessionID
        //       board{
        //         colsAndRows
        //       }
        //       dupeRow
        //     }
        //   `
        // });
        //Deep clone of cache object
        // let data = JSON.parse(JSON.stringify(localCache));
        // console.log('fragment',data)
        // data.board.colsAndRows[y][x] = board.colsAndRows[y][x];
        // data.dupeRow = dupeRow;
        // data.dupeCol = dupeCol;
        // data.culpritsCoords = culpritsCoords;
        // cache.writeFragment({
        //   id:data.sessionID,
        //   fragment:gql`
        //     fragment board on ready{
        //       board{
        //         colsAndRows
        //       }
        //       dupeCol
        //       dupeRow
        //       culpritsCoords{
        //         x
        //         y
        //       }
        //     }
        //   `,
        //   data
        // });
      }}
    >
      {clickOnTile => (
        <span
          onClick={() => {
            if (!locked) clickOnTile({ variables: { x, y } });
          }}
          className={style()}
        ></span>
      )}
    </Mutation>
  );
}

export default withApollo(Square);
