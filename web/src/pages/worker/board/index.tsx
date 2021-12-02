/**
 * 通过选择 tapd 的项目, 以项目中的迭代,
 * 按 tapd 中的用户, 展示任务队列
 *
 * 可以选择多项目, 多迭代
 * 通过多项目, 多迭代中负责人的属性进行任务归集展示
 */

import React from "react";
import DroppableColumn from "./components/ColumnComponent";
import FilterComponent from './components/FilterComponent';
import type {ProjectQueryType} from "./data";
import {Empty} from "antd";

interface WorkerBoardPropsType {
}

interface WorkerBoardStateType {
  query: ProjectQueryType[];
  queryTimes: number;
}

class WorkerBoard extends React.Component<WorkerBoardPropsType, WorkerBoardStateType> {

  constructor(props: WorkerBoardPropsType) {
    super(props);
    this.state = {query: [], queryTimes: 0}
  }

  componentDidMount() {
  }

  submitQuery = (filterProjects: ProjectQueryType[]) => {
    const queryTimes = this.state.queryTimes;
    this.setState({queryTimes: (queryTimes + 1)})
    this.setState({query: filterProjects})
  }

  render(){
    return <div>
      <div>
        <FilterComponent onQuery={this.submitQuery} />
      </div>
      {(this.state.query && this.state.query.length > 0)
        ? <div style={{ display: "flex", overflowX: 'auto' }}>
            <DroppableColumn key={this.state.queryTimes} query={this.state.query}/>
          </div>
        :<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'请选择过滤条件'}/>
      }
    </div>
  }
}

export default WorkerBoard;
