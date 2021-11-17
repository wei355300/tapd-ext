import {Effect, Reducer} from 'umi';
import {requestWorkerTraceData, requestProjects} from './service';
import {WorkerBoardQueryType, TraceDataType, WorkerTraceType} from './data';

export interface WorkerBoardStateType {
  list?: TraceDataType[],
  filterProjects?: WorkerBoardQueryType[],
  updateData?: {
    type: string,
    payload: any,
    data: WorkerTraceType
  },
  // projects?: [],
  // roles?: []
}

export interface WorkerBoardModelType {
  namespace: string;
  state: WorkerBoardStateType;
  effects: {
    fetchTraceData: Effect;
    fetchProjectsFilter: Effect;
  };
  reducers: {
    reOrderTraceData: Reducer;
    queryTraceData: Reducer;
    moveTraceData: Reducer;
    reverseDragTraceData: Reducer;
    queryProjects: Reducer;
  };
}

/**
 * 根据移动项目的位置, 重新设置任务权重
 * 重新排序仅更新权重
 */
const updateTraceWeightForOrder = (removed: WorkerTraceType, before: WorkerTraceType, after: WorkerTraceType) => {
  // fixme
  console.log('updateTraceWeightForOrder', 'removed', removed, 'before', before, 'after', after);
}

/**
 * 根据移动项目的位置, 重新设置任务权重
 * 移动需更新权重及负责人
 */
const updateTraceWeightForMove = (destTraceData: TraceDataType, removed: WorkerTraceType, before: WorkerTraceType, after: WorkerTraceType) => {
  // fixme
  console.log('updateTraceWeightForMove', 'destTraceData', destTraceData, 'removed', removed, 'before', before, 'after', after);
}

const WorkerBoardModel: WorkerBoardModelType = {
  namespace: 'WorkerBoard',
  state: {
    list: [],
    // projects: [],
    // roles: []
  },
  effects: {
     *fetchTraceData({payload}, {call, put}) {
       console.log('fetchTraceData', payload);
      const response = yield call(requestWorkerTraceData, payload);
      yield put({
        type: 'queryTraceData',
        payload: response.code === 0 ? (Array.isArray(response.data) ? response.data : []) : [],
      });
    },
    *fetchProjectsFilter({payload}, {call, put}) {
      const response = yield call(requestProjects, payload);
      console.log('fetchProjectsFilter', response);
      yield put({
        type: 'queryProjects',
        payload: response.code === 0 ? response.data : [],
      });
    }
  },
  reducers: {
    queryTraceData(state, action) {
      const newState = {
        ...state,
        list: action.payload,
        updateData: undefined
      };
      return newState;
    },
    /**
     * 同一个队列的数据重新排序.
     * 处理逻辑:
     *   将 workerData(某个队列)的 traces 数据拷贝一份,
     *   移除掉 startIndex(起始位置)的元素
     *   并将该元素插入到 endIndex 位置
     *
     */
    reOrderTraceData(state, action) {
      //action(payload) 格式:
      // payload: {
      //     index: sInd,
      //     startIndex: source.index,
      //     endIndex: destination.index
      // }
      //fixme 发送远程主流, 同步更新数据
      //参考: https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/responders.md#onDragEnd


      const list = state.list;
      const workerData = list[action.payload.index];
      const workerTraces = Array.from(workerData.traces);
      const [removed] = workerTraces.splice(action.payload.startIndex, 1);
      workerTraces.splice(action.payload.endIndex, 0, removed);

      updateTraceWeightForOrder(removed, workerTraces[action.payload.endIndex-1], workerTraces[action.payload.endIndex+1]);

      workerData.traces = workerTraces;
      const newList = [...list];
      newList[action.payload.index] = workerData;
      const newState = {
        ...state,
        list: newList,
        updateData: {type: "reorder", payload: action.payload, data: removed}
      };
      return newState;
    },
    /**
     * 不同队列之间元素移动.
     * 处理逻辑:
     *  将 sourceIndex 队列的 traces 的数据中的元素移除
     *  将元素插入到 destIndex 队列的 traces 的endIndex 中
     * @param state
     * @param action
     */
    moveTraceData(state, action) {
      //action(payload) 格式:
      // payload: {
      //     sourceIndex: sInd,
      //     destIndex: dInd,
      //     sourceStartIndex: source.index,
      //     destEndIndex: destination.index
      // }
      //fixme 发送远程主流, 同步更新数据
      const list = state.list;
      const sourceWorkerData = list[action.payload.sourceIndex];
      const destWorkerData = list[action.payload.destIndex];
      const sourceWorkerTraces = Array.from(sourceWorkerData.traces);
      const destWorkerTraces = Array.from(destWorkerData.traces);
      const [removed] = sourceWorkerTraces.splice(action.payload.sourceStartIndex, 1);

      destWorkerTraces.splice(action.payload.destEndIndex, 0, removed);

      updateTraceWeightForMove(destWorkerData, removed, destWorkerTraces[action.payload.destEndIndex-1], destWorkerTraces[action.payload.destEndIndex+1]);

      sourceWorkerData.traces = sourceWorkerTraces;
      destWorkerData.traces = destWorkerTraces;

      const newList = [...list];
      newList[action.payload.sourceIndex] = sourceWorkerData;
      newList[action.payload.destIndex] = destWorkerData;
      const newState = {
        ...state,
        list: newList,
        updateData: {type: "move", payload: action.payload, data: removed}
      };
      return newState;
    },
    reverseDragTraceData(state, action) {
      //根据 move, reorder 进行不同的数据还原
      //payload 的数据结构查看 reOrderTraceData 及 moveTraceData 的返回结果中的 updateData 结构
      // fixme
      // 权重的步长为1
      console.log('reverseDragTraceData', state, action);
    },
    queryProjects(state, action) {
      //根据 move, reorder 进行不同的数据还原
      //payload 的数据结构查看 reOrderTraceData 及 moveTraceData 的返回结果中的 updateData 结构
      // fixme
      // 权重的步长为1
      console.log('queryProjects', state, action);
      const newState = {
        ...state,
        filterProjects: [],
        // projects: action.payload.projects,
        // roles: action.payload.roles,
      };
      return newState;
    }
  }
}

export default WorkerBoardModel;
