import React from "react";
import {
  Button,
  Space,
  Cascader,
  Form
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import type {ProjectQueryType} from "../data";
import {requestProjects} from "../service";

interface FilterComponentPropsType {
  onQuery: any;
}

interface FilterComponentStateType {
  selectedQueries?: ProjectQueryType[];
  projects?: ProjectQueryType[];
  filterProjectOptions?: any[];
}

class FilterComponent extends React.Component<FilterComponentPropsType, FilterComponentStateType> {
  formRef = React.createRef<FormInstance>();

  constructor(props: FilterComponentPropsType) {
    super(props);
    this.state = { }
  }

  componentDidMount() {
    requestProjects().then((res) => {
      this.convertToFilterOptions(res.data);
    });
  }

  convertToFilterOptions = (projects: ProjectQueryType[]) => {
    this.setState({projects: projects})
    const projectOptions: any = [];
    projects.forEach(p => {
      const option = {
        value: p.id,
        label: p.name,
        type: 'p',
        children: []
      };
      const iterationChildren: any = [];
      const roleChildren: any = [];
      p.roles.forEach(r => {
        roleChildren.push({value: r.id, label: r.name, type: 'r'});
      })
      p.iterations.forEach(i => {
        const iterationChildrenItem = {
          value: i.id,
          label: i.name,
          type: 'i',
          children: roleChildren
        };
        iterationChildren.push(iterationChildrenItem);
      });
      option.children = iterationChildren;
      projectOptions.push(option)
    });
    this.setState({
      filterProjectOptions: projectOptions
    });
  }

  onChange = (values: any[][]) => {
    //values 是多维数组
    //第一维是项目, 第二维是迭代,第三维是角色
    //最后一维如果没有, 由表示为全选,
    //例: 仅二维数组: ['id', 'id'], 表示选择了项目+迭代, 而角色为全选
    if(!values || values.length === 0){
      this.setState({selectedQueries: []})
      return;
    }
    const selectedProjectValues: ProjectQueryType[] = [];
    const projectQueries = this.state.projects || [];
    values.forEach(v => {
      const selectedProject = projectQueries.find(p=>(p.id === v[0]));
      if(!selectedProject){
        return;
      }
      const selectedQuery: ProjectQueryType = {
        id: selectedProject.id,
        name: selectedProject.name,
        roles: [],
        iterations: []
      };
      const selectedRole = selectedProject.roles.find(r => (r.id===v[2]));
      if(selectedRole) {
        selectedQuery.roles.push(selectedRole);
      }
      else {
        selectedQuery.roles = selectedProject.roles;
      }

      const selectedIteration = selectedProject.iterations.find(i => (i.id===v[1]));
      if(selectedIteration) {
        selectedQuery.iterations.push(selectedIteration);
      }
      else {
        selectedQuery.iterations = selectedProject.iterations;
      }

      selectedProjectValues.push(selectedQuery);
    });

    this.setState({selectedQueries: selectedProjectValues});
  }

  submitQuery = () => {
    //最终需要上报的过滤条件, 不由表格的 form 值构成, 而是由 state 中的 selectedProjects 决定
    // 参考: #onChange() 的逻辑
    this.props.onQuery(this.state.selectedQueries);
  }

  render() {
    return <>
      <Form onFinish={this.submitQuery}>
        <Space>
          <Form.Item label={'选择项目'} name={'iterations'}>
            {/*todo 加载数据时, 需要交互 loading */}
            <Cascader
              style={{width: 240}}
              options={this.state.filterProjectOptions}
              multiple={true}
              onChange={this.onChange}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType={'submit'}>查询</Button>
          </Form.Item>
        </Space>
      </Form>
      </>
  }
}

export default FilterComponent;
