import request from 'umi-request';

import type {TraceDataType, ProjectQueryType} from './data';

export async function requestWorkerTraceData(params: ProjectQueryType[]) {
  console.log('requestWorkerTraceData', params);
  return request('/api/tapd/worker/board/traces', {
    data: params,
    method: "POST",
    requestType: "json"
  });
}

export async function orderWorkerTraceData(data: TraceDataType) {
  return request('/api/worker/board/order', {method: "PUT", params: {trace: data}});
}

export async function requestProjects(): Promise<{ data: ProjectQueryType[] }> {
  return request('/api/tapd/worker/board/projects', {method: "GET"});
}
