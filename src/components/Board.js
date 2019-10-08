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
                      if (data.dupeRow) {
                        dupeR = data.dupeRow.includes(y);
                      }
                      if (data.dupeCol) dupeC = data.dupeCol.includes(x);
                      return (
                        <Square
                          key={"col" + x}
                          locked={lockSquare}
                          value={value}
                          dupe={dupeR || dupeC}
                          coords={{ x, y }}
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
