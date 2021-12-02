/**
 * 使用 栅格列表(antd) 的形式展示队列信息
 */
import React from 'react';
// import {Empty, Space, Divider} from 'antd';
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {TraceDataType, ProjectQueryType} from "../data";
import {requestWorkerTraceData} from "../service";
import DroppableComponent from "./DroppableComponent";


interface DroppableColumnPropsType {
  query: ProjectQueryType[];
}

interface DroppableColumnStateType {
  // updateData?: any;
  list?: TraceDataType[];
}

class DroppableColumn extends React.Component<DroppableColumnPropsType, DroppableColumnStateType> {

  constructor(props: DroppableColumnPropsType) {
    super(props);
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    console.log('componentDidMount in cloumn', this.props.query)
    this.requestColumnData(this.props.query);
  }

  requestColumnData = (query: ProjectQueryType[]) => {
    if(!query || query.length === 0) {
      return;
    }
    requestWorkerTraceData(query)
      .then(res => {
        if(res.data) {
          this.setState({list: res.data})
        }
      })
      .catch(error => {
        console.log('requestWorkerTraceData error', error)
      });
  }

  // updateTraceData = () => {
  //   // 乐观更新:
  //   // 由于 dnd 在 drag 后, 需要同步更新 state,
  //   // request
  //   const updateDataPayload = this.props.updateData;
  //   console.log('updateDataPayload', updateDataPayload);
  //   if (updateDataPayload && updateDataPayload.data) {
  //     orderWorkerTraceData(updateDataPayload.data).then((res) => {
  //       message.success("success");
  //     }).catch((error) => {
  //       //根据 move, reorder 进行不同的数据还原
  //       const {dispatch} = this.props;
  //       message.error("error")
  //       dispatch({
  //         type: 'WorkerBoard/reverseDragTraceData',
  //         payload: updateDataPayload.paylaod,
  //       });
  //     });
  //   }
  // }

  onReOrder = (sInd: number, startIndex: number, endIndex: number) => {
    //action(payload) 格式:
    // payload: {
    //     index: sInd,
    //     startIndex: source.index,
    //     endIndex: destination.index
    // }

    const list = this.state.list || [];
    const workerData = list[sInd];
    const workerTraces = Array.from(workerData.traces);
    const [removed] = workerTraces.splice(startIndex, 1);
    workerTraces.splice(endIndex, 0, removed);

    // updateTraceWeightForOrder(removed, workerTraces[endIndex-1], workerTraces[endIndex+1]);

    workerData.traces = workerTraces;
    const newList = [...list];
    newList[sInd] = workerData;
    this.setState({list: newList})
    // const newState = {
    //   ...state,
    //   list: newList,
    //   updateData: {type: "reorder", payload: action.payload, data: removed}
    // };
    // return newState;
  }

  onMove = (sourceIndex: number, destIndex: number, sourceStartIndex: number, destEndIndex: number) => {
    const list = this.state.list || [];
    const sourceWorkerData = list[sourceIndex];
    const destWorkerData = list[destIndex];
    const sourceWorkerTraces = Array.from(sourceWorkerData.traces);
    const destWorkerTraces = Array.from(destWorkerData.traces);
    const [removed] = sourceWorkerTraces.splice(sourceStartIndex, 1);

    destWorkerTraces.splice(destEndIndex, 0, removed);

    // updateTraceWeightForMove(destWorkerData, removed, destWorkerTraces[destEndIndex-1], destWorkerTraces[destEndIndex+1]);

    sourceWorkerData.traces = sourceWorkerTraces;
    destWorkerData.traces = destWorkerTraces;

    const newList = [...list];
    newList[sourceIndex] = sourceWorkerData;
    newList[destIndex] = destWorkerData;
    this.setState({list: newList})
    // const newState = {
    //   ...state,
    //   list: newList,
    //   updateData: {type: "move", payload: action.payload, data: removed}
    // };
    // return newState;
  }

  onDragEnd = (result: any) => {

    const {source, destination} = result;

    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      this.onReOrder(sInd, source.index, destination.index);
    } else {
      this.onMove(sInd, dInd, source.index, destination.index);
    }
  }

  render() {
    const columnData = this.state.list;
    return <>
      {/* todo 加载或刷新数据时, 增加交互 loading */}
      {(columnData && columnData.length > 0)
        ? (
            <DragDropContext onDragEnd={this.onDragEnd}>
              {
                columnData.map((traceData, ind) => (
                  <Droppable key={ind} droppableId={`${ind}`}>
                    {(provided) => (
                      <DroppableComponent droppableProvided={provided} traceData={traceData}/>
                    )}
                  </Droppable>))}
            </DragDropContext>
          )
        : <></>
      }
    </>
  }
}

export default DroppableColumn;
