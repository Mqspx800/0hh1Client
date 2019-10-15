import React, { Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import Square from "./Square";

export const gameQuery = gql`
  query GameQuery {
    board {
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

const BOARD_UPDATE_SUBSCRIPTION = gql`
  subscription {
    boardUpdated {
      board {
        colsAndRows
        locked {
          x
          y
        }
      }
      dupeCol
      dupeRow
      culpritsCoords {
        x
        y
      }
    }
  }
`;

const gameInitMutation = gql`
  mutation BoardInit($size: Int!) {
    boardInit(size: $size)
  }
`;

class Board extends React.Component {
  state = { init: false, size: 6 };
  _boardUpdateSubscription = subscribeToMore => {
    subscribeToMore({
      document: BOARD_UPDATE_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const {
          boardUpdated: { board, dupeRow, dupeCol, culpritsCoords }
        } = subscriptionData.data;
        return Object.assign({}, prev, {
          board,
          dupeCol,
          dupeRow,
          culpritsCoords,
          ___typename: prev.board.___typename
        });
      }
    });
  };

  render() {
    return (
      <Fragment>
        <Mutation
          mutation={gameInitMutation}
          variables={{ size: this.state.size }}
          update={(_, { data: { boardInit } }) => {
            this.setState({ init: boardInit });
          }}
          refetchQueries={[{ query: gameQuery }]}
        >
          {gameinit => (
            <button className="startButton" onClick={gameinit}>
              <span></span>
            </button>
          )}
        </Mutation>

        <Query query={gameQuery}>
          {({ loading, error, data, subscribeToMore }) => {
            if (loading) return "Game Initilizing, please wait";
            if (error) return "Game not initialized";
            this._boardUpdateSubscription(subscribeToMore);
            const {
              board: { colsAndRows, locked },
              dupeRow,
              dupeCol,
              culpritsCoords
            } = data;

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
                            size={6}
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
      </Fragment>
    );
  }
}

export default Board;
