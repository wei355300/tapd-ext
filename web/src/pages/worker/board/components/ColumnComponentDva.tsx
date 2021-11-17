/**
 * 使用 栅格列表(antd) 的形式展示队列信息
 */
import React from 'react';
import {connect, Dispatch} from 'umi';
import {Card, message} from 'antd';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {TraceDataType, ProjectQueryType} from "../data";
import {WorkerBoardStateType} from "../model";
import {orderWorkerTraceData} from "../service";


interface DroppableColumnProps {
  query?: ProjectQueryType[];
  list?: TraceDataType[];
  updateData?: any;
  dispatch: Dispatch;
  loading: boolean;
}

class DroppableColumn extends React.Component<DroppableColumnProps> {

  constructor(props: DroppableColumnProps) {
    super(props);
    this.onDragEnd.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount in cloumn')
    const {dispatch} = this.props;
    const query = this.props.query;
    if (query) {
      dispatch({
        type: 'WorkerBoard/fetchTraceData',
        payload: {},
      });
    }
  }

  updateTraceData() {
    // 乐观更新:
    // 由于 dnd 的 drag 后, 需要同步更新 state,
    // request
    const updateDataPayload = this.props.updateData;
    console.log('updateDataPayload', updateDataPayload);
    if (updateDataPayload && updateDataPayload.data) {
      orderWorkerTraceData(updateDataPayload.data).then((res) => {
        message.success("success");
      }).catch((error) => {
        //根据 move, reorder 进行不同的数据还原
        const {dispatch} = this.props;
        message.error("error")
        dispatch({
          type: 'WorkerBoard/reverseDragTraceData',
          payload: updateDataPayload.paylaod,
        });
      });
    }
  }

  onDragEnd = (result: any) => {
    const {dispatch} = this.props;

    const {source, destination} = result;

    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      dispatch({
        type: 'WorkerBoard/reOrderTraceData',
        payload: {
          index: sInd,
          startIndex: source.index,
          endIndex: destination.index
        },
      });
    } else {
      dispatch({
        type: 'WorkerBoard/moveTraceData',
        payload: {
          sourceIndex: sInd,
          destIndex: dInd,
          sourceStartIndex: source.index,
          destEndIndex: destination.index
        },
      });
    }
  }

  render() {

    this.updateTraceData();

    return <>
      {(this.props.query && this.props.list) ? (
        <DragDropContext onDragEnd={this.onDragEnd}>
          {
            this.props.list?.map((traceData, ind) => (
              // <DroppableComponent traceData={traceData} index={ind} />
              <Droppable key={traceData.id} droppableId={`${ind}`}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <Card title={traceData.name} style={{width: 280}}>
                      {traceData.traces.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(draggableProvided) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                            >
                              <Card>
                                {item.name}
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Card>
                  </div>
                )}
              </Droppable>))}
        </DragDropContext>
      ) : <div>请选择过滤条件</div>}
    </>
  }
}

const mapState2Props = (state: {
  WorkerBoard: WorkerBoardStateType;
  loading: { models: { [key: string]: boolean } };
}) => {
  return {
    list: state.WorkerBoard.list || [],
    updateData: state.WorkerBoard.updateData || undefined,
    loading: state.loading.models['WorkerBoard'],
  }
}

export default connect(mapState2Props)(DroppableColumn);
