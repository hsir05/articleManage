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

  updateSel = async (values) => {
    try {
      let result = await API.updateArticle(values)
      console.log(result);
      if (result.status === '0') {
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
        console.log(this.props);
        if (this.props.match.params.id) {
          let par = { id:this.props.match.params.id, ...values }
          console.log(par);
          this.updateSel(par)
        } else {
          this.addDate(values)
        }
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

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 15 },
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

    return (
      <section >
        <BreadCrumb   {...this.state.data} />

        <Form onSubmit={this.handleSubmit}  className='form-wrop'>

          <FormItem {...formItemLayout} label="标题" hasFeedback >
            {getFieldDecorator('title', {
              rules: [ { required: true, message: '请输入文章标题'}],
            })(
              <Input className='form-page' />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="作者" hasFeedback  >
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

const FormPage = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    // console.log('======');
    // console.log(props)
    // console.log('--------');
    // console.log(Form.createFormField({...props}));
    return {
      // title: Form.createFormField({...props}),
      title: Form.createFormField({
        ...props.title,
        value: props.title.value,
      }),
      auth: Form.createFormField({
        ...props.auth,
        value: props.auth.value,
      }),
      content: Form.createFormField({
        ...props.content,
        value: props.content.value,
      })
    }
  },
  onValuesChange(_, values) {
    console.log(values);
  },
})(RegistrationForm)


class RegistForm extends React.Component {
  state = {
    fields: {
      // title:'',
      // auth:'',
      // content:'',
      title: {
        value: '',
      },
      auth: {
        value:'',
      },
      content:{
        value: ''
      }
    }
  }

  componentDidMount () {
    if (this.props.match.params.id) {
      this.getIdDate({id:this.props.match.params.id})
    }
  }

  getIdDate = async (values) => {
    try {
      let result = await API.getArticleList(values)
      let o = {
        title:{
          value: result.data.title
        },
        auth:{
          value:result.data.auth
        },
        content:{
          value:result.data.content
        }
      }
      this.setState({fields:o}, () => {
        console.log(this.state);
      })
    } catch (err) {
     console.log(err)
    }
  }

  handleFormChange = (changedFields) => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  }

  render () {
    const fields = this.state.fields;
    return (<div>
        <FormPage {...fields} {...this.props} onChange={this.handleFormChange} />
      </div>)
  }
}

export default RegistForm;
