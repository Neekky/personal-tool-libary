/* eslint-disable react/jsx-indent-props */
import Taro from '@tarojs/taro';
import React, { Component } from 'react';
import { View, ScrollView } from '@tarojs/components';
import classNames from 'classnames';
import './index.less';


/**
 * navBarList           导航栏标题数组
 * activeClass          被选中导航单元的类名
 * normalClass          普通导航单元的类名
 * sticky               是否黏性定位
 * navTop               黏性定位距离顶部高度
 * onNavChangeIndex     点击导航单元的回调
 * navBarColor          单元格之间分隔条的颜色
 * normalColor          普通导航单元格颜色
 */

const env = Taro.getEnv();
export default class index extends Component {
    state = {
        scrollLeft: 0,
        activeIndex: 0,
        navViewUpdate: [],
        screenWidth: 0,
        navContentPos: [],
        navItemPos: [],
        banScroll: false
    }

    componentDidMount() {
        Taro.getSystemInfo({
            success: (res) => {
                // 判断环境
                if (env === 'WEB') {
                    setTimeout(() => {
                        // 记录滑动内容各个区域的位置
                        let navContentPos = [];
                        this.props.children.forEach((child) => {
                            navContentPos.push(document.getElementById(child.props.id).offsetTop - res.screenHeight / 2);
                        });
                        window.onscroll = () => {
                            const { banScroll } = this.state;
                            if (!banScroll) {
                                navContentPos.forEach((cont, i) => {
                                    if (window.scrollY >= 0 && window.scrollY < navContentPos[0]) {
                                        let e = document.getElementsByClassName('nav-item')[0];
                                        this.onChange(0, e)
                                    } else if (window.scrollY >= navContentPos[i] && window.scrollY < navContentPos[i + 1]) {
                                        let e = document.getElementsByClassName('nav-item')[i];
                                        this.onChange(i, e)
                                    } else if (window.scrollY > navContentPos[navContentPos.length - 1]) {
                                        let e = document.getElementsByClassName('nav-item')[navContentPos.length - 1];
                                        this.onChange(navContentPos.length - 1, e)
                                    };
                                });
                            };
                        };
                    }, 1000);
                };

                if (env === 'WEAPP') {
                    const queryContent = Taro.createSelectorQuery();
                    const queryNav = Taro.createSelectorQuery();
                    setTimeout(() => {
                        let navContentPos = [];
                        let navItemPos = [];
                        this.props.children.forEach((child) => {
                            queryContent.select('#' + child.props.id).boundingClientRect();
                        });
                        queryContent.exec(rectRes => {
                            rectRes.forEach((detail, i) => {
                                navContentPos.push(rectRes[i].top - res.screenHeight / 2);
                            })
                            this.setState({
                                navContentPos
                            });
                        });
                        queryNav.selectAll('.nav-item').boundingClientRect().exec(navRes => {
                            navItemPos = navRes[0].map((nav) => nav.left);
                            this.setState({
                                navItemPos
                            });
                        })
                    }, 1000)
                }

                this.setState({
                    screenWidth: res.screenWidth
                });
            }
        })
        let navViewUpdate = []
        this.props.children.forEach((child) => {
            navViewUpdate.push(child.props.id)
        })

        this.setState({
            navViewUpdate
        })
    }

    // 处理小程序中页面滑动监听问题
    componentDidUpdate(newProps, newState) {
        const { pageScrollTop } = newProps;
        const { navContentPos, navItemPos } = newState;
        const { banScroll } = this.state;
        if (!banScroll && env === 'WEAPP') {
            navContentPos.forEach((cont, i) => {
                if (pageScrollTop >= 0 && pageScrollTop < navContentPos[0]) {
                    let e = { offsetLeft: navItemPos[0] };
                    this.onChange(0, e)
                } else if (pageScrollTop >= navContentPos[i] && pageScrollTop < navContentPos[i + 1]) {
                    let e = { offsetLeft: navItemPos[i] };
                    this.onChange(i, e);
                } else if (pageScrollTop > navContentPos[navContentPos.length - 1]) {
                    let e = { offsetLeft: navItemPos[navContentPos.length - 1] };
                    this.onChange(navContentPos.length - 1, e)
                };
            });
        };
    }

    /**
     * 改变时触发回调
     * @param {*} i 被点击索引
     * @param {*} e 事件对象
     */
    onChange = (i, e, isBar = false, id) => {
        const { onNavChangeIndex } = this.props;
        const { activeIndex, screenWidth } = this.state;
        if (activeIndex === i) return;

        let scrollLeft = 0;
        if (env === 'WEB') {
            const { offsetLeft, offsetWidth } = e;
            scrollLeft = offsetLeft - screenWidth / 2 + offsetWidth / 2;
            if (id) {
                let content = document.getElementById(id);
                window.scrollTo({
                    top: content.offsetTop,
                    behavior: "smooth"
                })
            };
        };

        if (env === 'WEAPP') {
            const { offsetLeft } = e;
            scrollLeft = offsetLeft - (screenWidth / 2) + (95 / 2);
            if (id) {
                Taro.pageScrollTo({
                    selector: '#' + id,
                    // success: () => { this.setState({ banScroll: false }) }
                });
            };
        };

        typeof onNavChangeIndex === 'function' && onNavChangeIndex(i, e);
        this.setState({
            activeIndex: i,
            scrollLeft,
            banScroll: isBar ? true : false
        });
    }

    onTouchStart = () => {
        this.setState({
            banScroll: false
        })
    }

    render() {
        const { navBarList, children, activeClass, normalClass, sticky, navTop, navBarColor, normalColor } = this.props;
        const { scrollLeft, activeIndex, navViewUpdate } = this.state
        return (
            <View className='anchor-nav__wrapper'>
                {/* 上部横向滚动条 */}
                <ScrollView enableFlex scrollX scrollWithAnimation scrollLeft={scrollLeft} className='nav-bar' style={{ position: sticky ? 'sticky' : 'inherit', top: (navTop && sticky) ? navTop : 0 }} id='nav-bar--query'>
                    {
                        navBarList.map((navText, i) => {
                            return (
                                <View
                                    onClick={(e) => {
                                        this.onChange(i, env === 'WEB' ? e.target : e.mpEvent.target, true, navViewUpdate[i])
                                    }}
                                    key={i}
                                    className={classNames(
                                        'nav-item', {
                                        [normalClass]: (normalClass && activeIndex !== i),
                                        [activeClass]: (activeClass && activeIndex === i),
                                        'nav-item--acitve': (!activeClass && activeIndex === i),
                                    })}
                                    style={{
                                        backgroundImage: (activeIndex !== i && activeIndex !== i + 1 && i !== navBarList.length - 1) ? `
                                        linear-gradient(to right, ${normalColor || '#0F5CFA'} 98.5%, transparent 98.5%),
                                        linear-gradient(to bottom, transparent 25%, ${navBarColor || '#F54100'} 25%, ${navBarColor || '#F54100'} 75%, transparent 75%, transparent 100%)`
                                            :
                                            '',
                                        backgroundColor: (activeIndex !== i && normalColor ) ? normalColor : ''
                                    }}
                                >
                                    {navText}
                                </View>
                            )
                        })
                    }
                </ScrollView>
                {/* 下部纵向滚动条 */}
                <View onTouchStart={this.onTouchStart} className='nav-content'>
                    {children}
                </View>
            </View >
        )
    }
}
