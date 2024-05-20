const { windowWidth } = my.getSystemInfoSync();

Component({
  data: {
    /** 当前轮播的卡片下标 */
    current: 0,
    /** 滚动距离 */
    scrollLeft: 0,
    /** 设备宽度 */
    windowWidth,
    /** 是否禁用因代码改动导致轮播图滚动的动画 */
    disableProgrammaticAnimation: false,
    /** 轮播数据 */
    dataList: [
      {
        id: '1',
        image: 'https://mdn.alipayobjects.com/huamei_rxmjuw/afts/img/A*YZDqT5yO8lMAAAAAAAAAAAAADuvJAQ/original',
      },
      {
        id: '2',
        image: 'https://mdn.alipayobjects.com/huamei_rxmjuw/afts/img/A*unrXQYmHzNIAAAAAAAAAAAAADuvJAQ/original',
      },
      {
        id: '3',
        image: 'https://mdn.alipayobjects.com/huamei_rxmjuw/afts/img/A*Ph6lRrHKN5sAAAAAAAAAAAAADuvJAQ/original',
      },
      {
        id: '4',
        image: 'https://mdn.alipayobjects.com/huamei_rxmjuw/afts/img/A*OML8SKbJ2A8AAAAAAAAAAAAADuvJAQ/original',
      },
    ],
  },
  methods: {
    /** 轮播切换回调 */
    onChange(current: number) {
      this.setData({ current });
      my.vibrateShort();
    },
  },
});
