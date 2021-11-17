
interface ProjectRoleQueryType {
  id: string;
  name: string;
}

interface ProjectIterationQueryType {
  id: string;
  name: string;
}

interface ProjectQueryType {
  id: string;
  name: string;
  roles: ProjectRoleQueryType[];
  iterations: ProjectIterationQueryType[];
}

export interface WorkerBoardQueryType {
  projects: ProjectQueryType[];
  // roles: ProjectRoleQueryType[];
}

interface WorkerTraceType {
  id: string;
  type: string; //任务类型: story(需求), task(任务), bug(缺陷)
  link: string;  //任务链接
  weight: number; //任务权重
  name: string; //任务名字
}

export interface TraceDataType {
  name: string;
  user: string;
  role: string;
  id: string;
  traces: WorkerTraceType[]; //任务列表
}
