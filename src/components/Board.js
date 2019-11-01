import React, { Fragment } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Square from "./Square";

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

export const GAMEQUERY = gql`
  query GameQuery {
    board {
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
      sessionID
    }
  }
`;

const READY_MUTATION = gql`
  mutation Ready {
    ready
  }
`;

class Board extends React.Component {
  state = { ready: false };
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
   // const { mode } = this.props.match.params;
    return (
      <Fragment>
        <Mutation
          mutation={READY_MUTATION}
          update={(_, { data }) => {
            console.log(data);
            if (data.ready) this.setState({ ready: true });
          }}
        >
          {(readyMutate, { data }) => {
            return (
              <button className="startButton" onClick={() => readyMutate()}>
                <span />
              </button>
            );
          }}
        </Mutation>
        {this.state.ready ? (
          <Query query={GAMEQUERY}>
            {({ loading, error, data, subscribeToMore }) => {
              if (loading) return "loading";
              if (error) return "error";
              const { board } = data;
              return board.map((boardWithCulprits, bid) => {
                const {
                  board: { colsAndRows, locked },
                  dupeRow,
                  dupeCol,
                  culpritsCoords
                } = boardWithCulprits;
                return (
                  <Fragment key={"board_area"}>
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
                                key={`${bid}|${x},${y}`}
                                locked={lockSquare}
                                value={value}
                                dupe={dupeR || dupeC}
                                coords={{ x, y }}
                                error={error}
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </Fragment>
                );
              });
            }}
          </Query>
        ) : (
          <h1>Waiting for other players</h1>
        )}
      </Fragment>
    );
  }
}

//   return (
//     <Fragment>
//       <Mutation
//         mutation={gameInitMutation}
//         variables={{ size: this.state.size }}
//         update={(_, { data: { boardInit } }) => {
//           this.setState({ init: boardInit });
//         }}
//         refetchQueries={[{ query: gameQuery }]}
//       >
//         {gameinit => (
//           <button className="startButton" onClick={gameinit}>
//             <span />
//           </button>
//         )}
//       </Mutation>

//       <Query query={gameQuery}>
//         {({ loading, error, data, subscribeToMore }) => {
//           if (loading)
//             return (
//               <p style={{ color: "red", background: "white" }}>
//                 "Game Initilizing, please wait"
//               </p>
//             );
//           if (error)
//             return (
//               <p style={{ color: "red", background: "white" }}>
//                 "Game not initilized"
//               </p>
//             );
//           this._boardUpdateSubscription(subscribeToMore);
//           const {
//             board: { colsAndRows, locked },
//             dupeRow,
//             dupeCol,
//             culpritsCoords
//           } = data;

//           return (
//             <Fragment>
//               {colsAndRows.map((row, y) => {
//                 return (
//                   <div key={"row" + y}>
//                     {row.map((value, x) => {
//                       const lockSquare = !!locked.find(
//                         e => e.x === x && e.y === y
//                       );
//                       let dupeR = false;
//                       let dupeC = false;
//                       if (dupeRow) {
//                         dupeR = dupeRow.includes(y);
//                       }
//                       if (dupeCol) dupeC = dupeCol.includes(x);
//                       const error =
//                         culpritsCoords &&
//                         culpritsCoords.find(c => c.x === x && c.y === y);
//                       return (
//                         <Square
//                           key={"col" + x}
//                           locked={lockSquare}
//                           value={value}
//                           dupe={dupeR || dupeC}
//                           coords={{ x, y }}
//                           error={error}
//                           size={6}
//                         />
//                       );
//                     })}
//                   </div>
//                 );
//               })}
//             </Fragment>
//           );
//         }}
//       </Query>
//     </Fragment>
//   );
// }

export default Board;
