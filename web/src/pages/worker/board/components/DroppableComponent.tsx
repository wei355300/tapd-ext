
import React from 'react';
import {Card, Badge} from "antd";
import {Draggable, DroppableProvided} from "react-beautiful-dnd";
import {TraceDataType, WorkerTraceType} from "@/pages/worker/board/data";

interface DataComponentPropsType {
  droppableProvided: DroppableProvided,
  traceData: TraceDataType
}

/**
 * 卡片组件
 * 展示 tapd 的基础信息, 链接到 tapd 详情页面
 */
class DroppableComponent extends React.Component<DataComponentPropsType> {

  constructor(props: DataComponentPropsType) {
    super(props);
    this.state = {
    }
  }

  getRibbon = (data: WorkerTraceType) => {
    let ribbon = {
      text: '',
      color: 'blue'
    }
    switch (data.type) {
      case 'story':
        ribbon = {
          text: '需求',
          color: 'blue'
        }
        break;
      case 'bug':
        ribbon = {
          text: '缺陷',
          color: 'red'
        }
        break;
      case 'task':
        ribbon = {
          text: ' 任务',
          color: 'grey'
        }
        break;
    }
    return ribbon;
  }

  render() {
    const provided = this.props.droppableProvided;
    const traceData = this.props.traceData;
    return <div
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      <Card title={traceData.user} style={{width: 280}} >
        {traceData.traces.map((item, index) => (
          <Draggable
            key={item.id+"_"+traceData.user}
            draggableId={item.id+"_"+traceData.user}
            index={index}
          >
            {(draggableProvided) => (
              <div
                ref={draggableProvided.innerRef}
                {...draggableProvided.draggableProps}
                {...draggableProvided.dragHandleProps}
              >
                <Badge.Ribbon {...this.getRibbon(item)}>
                  <Card>
                    {<a target="_blank" href={item.link}>{item.name}</a>}
                  </Card>
                </Badge.Ribbon>
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </Card>
    </div>
  }
}

export default DroppableComponent;
