import React from 'react';
import { PageHeader, List, Pagination, Input, Spin } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { videoList, videoSearch, videoTagList } from 'actions';
import { MainLayout, VideoArticleItem, VideoEditModal } from 'components';
import { VideoArticle } from 'models';
import { PAGE_SIZE } from 'config';
import './article.css';

const { Search } = Input;

interface Props extends RouteComponentProps {
  videoList(): ReturnType<typeof videoList.request>;
  videoTagList(): ReturnType<typeof videoTagList.request>;
  videoSearch(query: string): ReturnType<typeof videoSearch.request>;
  searched: VideoArticle[];
  loading: boolean;
}

interface State {
  videoEditModalVisible: boolean;
  article: VideoArticle | null;
  page: number;
}

class VideoArticleListPage extends React.Component<Props, State> {
  query = '';
  
  state = {
    videoEditModalVisible: false,
    article: null,
    page: 1,
  }
  
  componentDidMount() {
    this.props.videoList();
    this.props.videoTagList();
  }
  
  render() {
    const { searched, loading } = this.props;
    const { page, videoEditModalVisible, article } = this.state;
    const { query } = this;
    
    const sliced = searched.slice((page - 1) * PAGE_SIZE, (page) * PAGE_SIZE);
    
    return (
      <MainLayout>
        <div className="article-list-page">
          <div className="page-header">
            <PageHeader onBack={() => null} title="Video" subTitle="영화, 드라마, 예능" />
            <Search onChange={this.onQueryChange} enterButton />
          </div>
          <Spin spinning={loading} tip="로딩중...">
            <List
              dataSource={sliced}
              renderItem={article => <VideoArticleItem article={article} highlight={query} onEditClicked={this.onEditClicked} />}
            />
          </Spin>
          <Pagination current={page} total={searched.length} pageSize={PAGE_SIZE} onChange={this.onPageChange} />
        </div>
        { (article) ? <VideoEditModal visible={videoEditModalVisible} onClose={this.onModalClose} article={article!}/> : null }
      </MainLayout>
    )
  }
  
  onQueryChange = (e) => {
    const query = e.target.value;
    this.props.videoSearch(query);
    this.query = query;
    this.setState({ page: 1 });
  }
  
  onPageChange = (page: number) => {
    this.setState({ page })
  }
  
  onEditClicked = (article: VideoArticle) => {
    this.setState({ videoEditModalVisible: true, article });
  }
  
  onModalClose = () => {
    this.setState({ videoEditModalVisible: false, article: null });
  }
}

let mapDispatchToProps = {
  videoList: videoList.request,
  videoTagList: videoTagList.request,
  videoSearch: videoSearch.request,
}

let mapStateToProps = (state) => {
  return {
    searched: state.video.searched,
    loading: state.video.loading,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VideoArticleListPage));