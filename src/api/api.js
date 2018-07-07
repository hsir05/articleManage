import Server from './server';

class API extends Server{
  /**
   *  用途：上传图片
   *  @url http://localhost:8888/api/upload
   *  返回status为1表示成功
   *  @method post
   *  @return {promise}
   */
  async uploadImg(params = {}){
    try{
      let result = await this.axios('post', 'http://localhost:8888/api/upload', params);
      if(result && result.status === 1){
        return result;
      }else{
        let err = {
          tip: '上传图片失败',
          response: result,
          data: params,
          url: 'http://localhost:8888/api/upload',
        }
        throw err;
      }
    }catch(err){
      throw err;
    }
  }

  /**
   *  用途：获取文章列表数据
   *  @url http://localhost:8888/api/article
   *  返回status为0表示成功
   *  @method get
   *  @return {promise}
   */
  async getArticleList(params = {}){
    try{
      let result = await this.axios('get', '/article', params)
      if(result && result.status === '0'){
        return result
      }else{
        throw result
      }
    }catch(err){
      throw err
    }
  }
}

export default new API();
