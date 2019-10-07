import React, { Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import Square from "./Square";

const gameQuery = gql`
  query GameQuery($size: Int!) {
    boardInit(size: $size) {
      board
      locked {
        x
        y
      }
    }
    dupeRow
    dupeCol
  }
`;

const clickTileMutation = gql`
  mutation clickOnTile($x: Int!, $y: Int!) {
    clickOnTile(x: $x, y: $y) {
      locked {
        x
        y
      }
    }
  }
`;

class Board extends React.Component {
  render() {
    return (
      <Mutation mutation={clickTileMutation}>
        {clickOnTile => (
          <Query query={gameQuery} variables={{ size: 6 }}>
            {({ loading, error, data }) => {
              if (loading) return "Game Initilizing, please wait";
              if (error) return "an error occur...";
              const { locked, board } = data.boardInit;
              return (
                <Fragment>
                  {board.map((row, colIndice) => {
                    return (
                      <div key={"col" + colIndice}>
                        {row.map((value, rowIndice) => {
                          const lockSquare = !!locked.find(
                            e => e.x === rowIndice && e.y === colIndice
                          );
                          let dupeR = false;
                          let dupeC = false;
                          if (data.dupeRow) {
                            dupeR = data.dupeRow.includes(rowIndice);
                          }
                          if (data.dupeCol)
                            dupeC = data.dupeRow.includes(colIndice);
                          return (
                            <Square
                              key={"row" + rowIndice}
                              locked={lockSquare}
                              value={value}
                              dupe={dupeR || dupeC}
                              coords={{ x: rowIndice, y: colIndice }}
                              onClick={clickOnTile}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </Fragment>
              );
            }}
          </Query>
        )}
      </Mutation>
    );
  }
}

export default Board;
