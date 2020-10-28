// page/components/sharePopup/index.js
const { saveRemoteImages } = require('../../../util/saveImage');
const {
	throttle
} = require('../../../util/index');


Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		extClass: {
			type: String,
			value: ''
		},
		show: {
			type: Boolean,
			value: false,
			observer: 'updateRatio'
		},
		shareImages: {
			type: Array,
			value: [],
			observer: 'updateRatioList'
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		showTwo: false,
		shareImages: [],
		checkIndexList: [true],
		curTabIndex: 0,
		baseRatio: 0,
		ratioList: []
	},

	attached() {
		this.setData({
			windowReferWidth: wx.getSystemInfoSync().windowWidth
		})
	},

	/*组件所在页面的生命周期 */
	pageLifetimes: {
		show: function () {
			// 页面被展示
			this.setData({
				statusBarHeight: getApp().globalData.statusBarHeight
			})
		},
		hide: function () {
			// 页面被隐藏
			console.log("页面被隐藏")
		},
		resize: function (size) {
			// 页面尺寸变化
			console.log("页面尺寸变化")
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 点击遮罩
		onClickMask: function (e) {
			this.setData({
				show: false
			})
		},

		// 点击轮播图
		onSwiperTimeHandle: function (e) {
			if (this.data.showTwo) {
				return;
			}
			let list = this.data.checkIndexList;
			let index = e.currentTarget.dataset.index;
			list[index] = !list[index];
			this.setData({
				checkIndexList: [...list]
			});
		},

		onSave: function (e) {
			this.saveImages().then(() => {
				wx.showToast({
					title: '图片已保存至相册',
					icon: 'none'
				});
			})
		},

		saveImages: function () {
			return this.check().then(saveRemoteImages);
		},

		check: function () {
			let checkList = this.data.checkIndexList;
			let images = this.data.shareImages.filter((item, index) => checkList[index]);
			if (!images.length) {
				wx.showToast({
					title: '请选择海报',
					icon: 'none'
				});
				return Promise.reject();
			}
			return Promise.resolve(images);
		},

		onTransition: function (e) {
			const query = wx.createSelectorQuery().in(this)
			query.selectAll('.swiper-item-imageBox').boundingClientRect((res) => {
				let ratioList = [];

				res.forEach(ele => {
					// let distance = Number(Math.abs(ele.left + (ele.width / 2)).toFixed(0));
					// let midDistance = Math.abs(distance - (this.data.windowReferWidth / 2) + 30);
					// let ratio = 0;
					// console.log(midDistance)
					// if (midDistance > (this.data.windowReferWidth / 2 + 30)) {
					// 	ratio = 0.9;
					// } else if (midDistance < 32) {
					// 	ratio = 1;
					// } else {
					// 	let res = 1 - midDistance / (this.data.windowReferWidth / 2) * 0.1;
					// 	ratio = res < 0.9 ? 0.9 : res;
					// }
					let distance = Number(Math.abs(ele.left).toFixed(0));
					let ratio = 0;
					if (distance > (this.data.windowReferWidth - 20)) {
						ratio = 0.9;
					} else if (distance < 20) {
						ratio = 1;
					} else {
						let res = 1 - (distance / this.data.windowReferWidth * 0.1);
						ratio = res < 0.9 ? 0.9 : res;
					}
					ratioList.push(ratio.toFixed(3));
				});
				this.setData({
					ratioList
				});
			}).exec()
		},

		onChange: function (e) {
			this.setData({
				curTabIndex: e.detail.current
			})
		},

		onAnimationfinish: function (e) {
			console.log('我结束了')
		},

		updateRatioList: function (newVal) {
			let ratioList = newVal.map((ele, index) => {
				return index === 0 ? 1 : 0.9
			})
			this.setData({
				ratioList
			});
		},

		updateRatio: function () {
			let ratioList = this.data.shareImages.map((ele, index) => {
				return index === 0 ? 1 : 0.9
			})
			this.setData({
				ratioList
			});
		},
		preventDefault: function (e) {

		}
	}
})
