import React, { Component } from 'react';
import { View } from '@tarojs/components';
import { AnchorNavView, CitySwitch, BottomSwitch } from '@/components/index'
import './index.less';


export default class index extends Component {
    state = {
        navBarList: ['爆款推荐', '人气乐园', '运动乐园', '探索童趣', '亲子乐园', '家庭中心', '明星爆品', '年度爆款'],
        pageScrollTop: 0,
        isShowCitySwitch: false,
        cityList: ['上海', '北京', '广州', '长沙', '深圳', '石家庄', '哈尔滨', '呼和浩他', '杭州', '安徽', '西藏'],
        curIndex: 0,
        moduleIndex: 0
    }

    onNavChangeIndex = (i, e) => {
        console.log(i, e)
    }

    onPageScroll = (e) => {
        this.setState({
            pageScrollTop: e.scrollTop
        })
    }

    onClickMask = () => {
        this.setState({
            isShowCitySwitch: false
        })
    }

    onClickCity = (data) => {
        this.setState({
            curIndex: data.index,
            curCity: data.cityName,
            isShowCitySwitch: false
        })
    }

    handleClickBanner = () => {
        this.setState({
            isShowCitySwitch: true
        })
    }

    onClickModule = (index) => {
        this.setState({
            moduleIndex: index
        })
    }

    render() {
        const { navBarList, pageScrollTop, isShowCitySwitch, cityList, curIndex, curCity, moduleIndex} = this.state;
        return (
            <View className='demo-wrapper'>
                <View className='demo-banner' onClick={this.handleClickBanner}>{curCity}</View>
                <CitySwitch 
                    isShow={isShowCitySwitch} 
                    onClickMask={this.onClickMask} 
                    onClickCity={this.onClickCity}
                    cityList={cityList}
                    mainColor='#F52032'
                    curIndex={curIndex}
                    navBarColor='#DB0012'
                />
                <AnchorNavView
                    navBarList={navBarList}
                    activeClass='nav-active-item'
                    normalClass='nav-normal-item'
                    sticky
                    navTop='70px'
                    onNavChangeIndex={this.onNavChangeIndex}
                    navBarColor='#0E52DD'
                    pageScrollTop={pageScrollTop}
                    normalColor='#F52032'
                >
                    <View id='anchor-nav-1'>爆款推荐</View>
                    <View id='anchor-nav-2'>人气乐园</View>
                    <View id='anchor-nav-3'>运动乐园</View>
                    <View id='anchor-nav-4'>探索童趣</View>
                    <View id='anchor-nav-5'>亲子乐园</View>
                    <View id='anchor-nav-6'>家庭中心</View>
                    <View id='anchor-nav-7'>明星爆品</View>
                    <View id='anchor-nav-8'>年度爆款</View>
                </AnchorNavView>
                <BottomSwitch 
                    curIndex={moduleIndex} 
                    onClickModule={this.onClickModule}
                />
            </View>
        )
    }
}
