import React, { Fragment } from "react";
import { Query, withApollo } from "react-apollo";
import gql from "graphql-tag";
import Square from "./Square";

export const gameInitQuery = gql`
  query GameQuery($size: Int!) {
    boardInit(size: $size) {
      colsAndRows
      locked {
        x
        y
      }
    }
    dupeRow
    dupeCol
    culpritsCoords {
      x
      y
    }
  }
`;

class Board extends React.Component {
  render() {
    return (
      <Query query={gameInitQuery} variables={{ size: 6 }}>
        {({ loading, error, data }) => {
          if (loading) return "Game Initilizing, please wait";
          if (error) return "an error occur...";
          const { locked, colsAndRows } = data.boardInit;
          const { dupeRow, dupeCol, culpritsCoords } = data;
          return (
            <Fragment>
              {colsAndRows.map((row, y) => {
                return (
                  <div key={"row" + y}>
                    {row.map((value, x) => {
                      const lockSquare = !!locked.find(
                        e => e.x === x && e.y === y
                      );
                      let dupeR = false;
                      let dupeC = false;
                      if (dupeRow) {
                        dupeR = dupeRow.includes(y);
                      }
                      if (dupeCol) dupeC = dupeCol.includes(x);
                      const error =
                        culpritsCoords &&
                        culpritsCoords.find(c => c.x === x && c.y === y);
                      return (
                        <Square
                          key={"col" + x}
                          locked={lockSquare}
                          value={value}
                          dupe={dupeR || dupeC}
                          coords={{ x, y }}
                          error={error}
                          onClick={this.clickOnTile}
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
    );
  }
}

export default withApollo(Board);
