import React from "react";
import ProForm, {
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormDependency
} from '@ant-design/pro-form';
import {ProjectQueryType, WorkerBoardQueryType} from "../data";
import {requestProjects} from "../service";
import {ProFormInstance} from "@ant-design/pro-form";

interface FilterComponentPropsType {
  onQuery: any;
}

interface FilterComponentStateType {
  query?: WorkerBoardQueryType[];
  projects: ProjectQueryType[];
}

interface OptionsType {
  id: string,
  name: string
}

class FilterComponent extends React.Component<FilterComponentPropsType, FilterComponentStateType> {
  formRef = React.createRef<ProFormInstance>();

  constructor(props: FilterComponentPropsType) {
    super(props);
    this.state = {
      projects: []
    }
  }


  componentDidMount() {
    requestProjects().then((res) => {
      this.setState({
        projects: res.data
      });

      if(this.formRef.current && this.state.projects){
        console.log('set init form values', this.state.projects);
        this.formRef.current.setFieldsValue({projects: this.state.projects});
      }
    });
  }

  // submitQuery(values) {
  //   console.log('submitQuery', values);
  // }

  setSelectOptions(values: OptionsType[]) {
    console.log(typeof values);
    console.log('setSelectOptions', values);
    if (!values){
      return;
    }
    return values.map((v)=>(
      {label: v.name, value: v.id}
    ));
  }

  render() {
    return <ProForm
      onFinish={async (values) => {
        console.log('Received values of form:', values);
      }}
      submitter={{
        // 配置按钮文本
        // searchConfig: {
        //   resetText: '重置',
        //   submitText: '提交',
        // },
        // 配置按钮的属性
        resetButtonProps: {
          style: {
            // 隐藏重置按钮
            display: 'none',
          },
        },
        // submitButtonProps: {},

        // 完全自定义整个区域
        // render: (props, doms) => {
        //   console.log(props);
        //   return [
        //     <button type="button" key="rest" onClick={() => props.form?.resetFields()}>
        //       重置
        //     </button>,
        //     <button type="button" key="submit" onClick={() => props.form?.submit?.()}>
        //       提交
        //     </button>,
        //   ];
        // },
      }}
      formRef={this.formRef}>
        <ProFormList
          name={['projects']}
          itemContainerRender={(doms) => {
            return <ProForm.Group>{doms}</ProForm.Group>;
          }}
          creatorButtonProps={{
            "creatorButtonText": "其它项目",
          }}
        >
          <ProFormText name="name" label="项目" disabled={true} />
          <ProFormDependency name={['iterations']}>
            {(values) => (
              <ProFormSelect name={['projects','iterations']} label={'迭代'} options={this.setSelectOptions(values.iterations)}/>
            )}
          </ProFormDependency>
          <ProFormDependency name={['roles']}>
            {(values) => (
              <ProFormSelect name={['projects', 'roles']} label={'角色'} options={this.setSelectOptions(values.roles)}/>
            )}
          </ProFormDependency>
        </ProFormList>
      </ProForm>
  }
}

export default FilterComponent;
