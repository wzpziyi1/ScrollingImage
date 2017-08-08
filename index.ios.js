/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TextInput,
} from 'react-native';

var screenW = Dimensions.get('window').width;

export default class ScrollDemo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      listData: [],
      curPage: 0,
    };
  }

  render() {

    return (
      <View>
        <ScrollView ref="scrollView" style={{width: screenW, height: 240, backgroundColor: 'red'}}
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={this._onMomentumScrollEnd.bind(this)}
                    onScrollBeginDrag={this._onScrollBeginDrag.bind(this)}
                    onScrollEndDrag={this._onScrollEndDrag.bind(this)}

        >
          {this._renderImageViews(this.state.listData)}
        </ScrollView>

        <View style={styles.bottomStyle}>
          <Text style={{color: 'white', paddingLeft: 10}}>{this._getZhuboTitle()}</Text>
          <View style={{flexDirection: 'row', marginRight: 5, alignItems: 'center', height: 45, position: 'absolute', right: 20}}>
            {this._renderIndicatorView()}
          </View>
        </View>
      </View>
    );
  }

  componentDidMount() {
    let listData = require('./Resource/zhubo.json');

    this.timer = setInterval(this._updateUI.bind(this), 1000);

    this.setState({
      listData: listData,
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  //渲染UI
  _renderImageViews(listData) {

    let imageArr = [];
    for (let i = 0; i < listData.length; i++)
    {
      let json = listData[i];

      imageArr.push(
          <Image source={{uri:json.icon}}
                 style={{width: screenW, height:300, backgroundColor: 'yellow'}}
                 key={i}
          />
      )
    }
    return imageArr;
  }

  _renderIndicatorView() {
    let listData = this.state.listData;
    let childArr = [];

    listData.forEach((value, i)=>{
      childArr.push(
          <View style={i == this.state.curPage ? styles.activeDotStyle : styles.dotStyle}
                key={i}
          />
      )
    })
    return childArr;
  }

  //ScrollView的方法转接
  _onMomentumScrollEnd(e) {

    let offset = e.nativeEvent.contentOffset;
    var curPage = offset.x / screenW;

    this.setState({
      curPage: curPage,
    })
  }

  _onScrollBeginDrag(e) {
    clearInterval(this.timer);
  }

  _onScrollEndDrag(e) {
    this.timer = setInterval(this._updateUI.bind(this), 1000);
  }


  //逻辑处理
  _getZhuboTitle() {
    var zhubo = this.state.listData[this.state.curPage];
    if (zhubo == undefined) return '';
    return zhubo.title;
  }

  _updateUI() {

    let curPage = this.state.curPage + 1;
    let animated = true;
    if (curPage >= this.state.listData.length)
    {
      curPage = 0;
      animated = false;
    }

    this.setState({
      curPage: curPage,
    });

    let scrollView = this.refs.scrollView;
    let offsetX = screenW * curPage;


    scrollView.scrollTo({x: offsetX, y: 0, animated: animated});


  }
}

const styles = StyleSheet.create({
  bottomStyle:{
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: screenW,
    height: 45,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  dotStyle:{
    width:6,
    height:6,
    borderRadius:3,
    backgroundColor:'white',
    marginLeft:4
  },
  activeDotStyle:{
    width:10,
    height:10,
    borderRadius:5,
    backgroundColor:'red',
    marginLeft:4
  }
});

AppRegistry.registerComponent('ScrollDemo', () => ScrollDemo);
