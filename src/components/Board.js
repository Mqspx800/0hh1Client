import React, { Fragment } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const gameQuery = gql`
  query GameQuery($size: Int!) {
    boardInit(size: $size) {
      board
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
      <Query query={gameQuery} variables={{ size: 8 }}>
        {({ loading, error, data }) => {
          if (loading) return "Game Initilizing, please wait";
          if (error) return "an error occur...";

          return (
            <Fragment>
              {data.boardInit.board.map((row,index) => {
                return (
                  <div key = {index+'row'}>
                    {row.map(tile => {
                      return tile;
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

export default Board;
