import React from 'react'
import BreadCrumb from '../../components/breadCrumb/breadCrumb.jsx'
import API from '../../api/api'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option
import './add.scss'

class RegistrationForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      data: {
        list: [{url:'/', menuName:'首页', icon:''}, {url:null, menuName:'添加', icon:''}],
        btn: {addUrl:'/', btnName: '返回', icon:'left'}
      }
    }
  }

  addDate = async (values) => {
    try {
      let result = await API.addArticle(values)
      if (result.status === '0') {
        this.setState({articleList:result.data})
         this.props.history.push('/')
      }
    } catch (err) {
     console.log(err)
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.addDate(values)
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ))

    return (
      <section >
        <BreadCrumb   {...this.state.data} />
        <Form onSubmit={this.handleSubmit} className='form-wrop'>
        <FormItem
          {...formItemLayout}
          label="标题"
          hasFeedback
        >
          {getFieldDecorator('title', {
            rules: [ {
              required: true, message: '请输入文章标题',
            }],
          })(
            <Input className='form-page' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="作者"
          hasFeedback
        >
          {getFieldDecorator('auth', {
            rules: [{ required: true, message: '请输入作者姓名'}],
          })( <Input className='form-page' /> )}
        </FormItem>

        <FormItem {...formItemLayout} label="内容" hasFeedback >
          {getFieldDecorator('content', {
            rules: [{ required: true, message: '请输入内容'}],
          })( <TextArea placeholder="请输入内容" className='form-page' autosize={{ minRows: 2, maxRows: 6 }} /> )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">保存</Button>
        </FormItem>
      </Form>
      </section>

    )
  }
}

const FormPage = Form.create()(RegistrationForm);

export default FormPage;
