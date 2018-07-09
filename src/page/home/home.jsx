import React from 'react'
import {Link} from 'react-router-dom'
import { Table, Icon, Button, Popconfirm } from 'antd'
import BreadCrumb from '../../components/breadCrumb/breadCrumb.jsx'
import Search from './search.jsx'
import API from '../../api/api'
import './home.scss'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      articleList: [],
      columns: [
        { title: '标题', dataIndex: 'title'},
        { title: '作者', dataIndex: 'auth', render: text => <a href="javascript:;">{text}</a>},
        { title: '添加时间', dataIndex: 'create_at' },
        { title: '操作', dataIndex: '', create_at: 'x', render: (record) =>
        <p>
          <Popconfirm title="你确定要删除?" onConfirm={() => this.deleteSel(record._id)}>
            <Button type="danger"  style={{marginRight:'5px'}}>删除</Button>
          </Popconfirm>
          <Button type="primary" ><Link to={`/edit/${record._id}`}>修改</Link></Button>
        </p> }
      ],
      data: {
        list: [{url:'/', menuName:'首页', icon:''}, {url:null, menuName:'home', icon:''}],
        btn: {addUrl:'/add', btnName: '添加', icon:'plus'}
      },
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User',
          name: record.name,
        }),
      }
    }
  }

  componentDidMount () {
    this.initDate()
  }

  initDate = async () => {
    try {
      let result = await API.getArticleList()
      this.setState({articleList:result.data})
    } catch (err) {
     console.log(err)
    }
  }

  deleteSel = async (id) => {
    try {
      let result = await API.delteArticle({id:id})
      console.log(result);
      if (result.status === '0') {
        this.initDate()
      }
    } catch (err) {
     console.log(err)
    }
  }

  render() {

    return (
      <section>
        <BreadCrumb   {...this.state.data} />
        <div style={{background:'white', padding:'15px', paddingTop:'0'}}>
          <Search />
          <Table rowSelection={this.state.rowSelection} columns={this.state.columns} rowKey={'_id'} dataSource={this.state.articleList} />
        </div>
     </section>
    )
  }
}

export default Home;
