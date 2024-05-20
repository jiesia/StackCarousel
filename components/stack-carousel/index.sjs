/**
 * 需要调整轮播图位置大小时, 修改下面三个参数值以及 swiper-view-item 元素的宽度即可
 * 注意: 计算间距时需要取三个卡片等比放大后的间距
 */

/** 第一个日历卡片与第二个日历卡片之间的间距 */
const firstSpacing = 237;
/** 第二个日历卡片与第三个日历卡片之间的间距 */
const secondSpacing = 150;

let current = 0;

/**
 * 处理滑动卡片事件
 * @see https://opendocs.alipay.com/mini/01og7z?pathHash=bc2600eb
 */
function handleScrollEvent(event, ownerComponent) {
  const {
    scrollLeft
  } = event.instance.getDOMProperty(['scrollLeft']);
  const {
    windowWidth,
    total
  } = event.instance.getDataset();

  const swiperWrapper = ownerComponent.selectComponent('.swiper-view-wrapper');
  swiperWrapper.setStyle({
    transform: `translateX(${-scrollLeft}px)`,
  });

  const swiperItems = ownerComponent.selectAllComponents('.swiper-view');
  swiperItems.forEach((item, index) => {
    const progress = scrollLeft / windowWidth - index;

    // 右边的滑块, 改变其 位移、缩放、透明度
    if (progress <= 0) {
      /**
       * 滑动到最右边时, 处理兜底滑动的位置和大小
       * progress   -2    ->    -1
       * scale     1-0.2  ->   1-0.2
       * scale = 0.8
       */
      if (index === total && scrollLeft >= (total - 2) * windowWidth) {
        const innerProgress = progress >= -1 ? -1 : -2;
        item.setStyle({
          transform: `
            translateX(${innerProgress * windowWidth *
            (1 -
              ((firstSpacing - secondSpacing) / 2 * innerProgress + (firstSpacing * 3 / 2 - secondSpacing / 2)) /
              750
            ) + scrollLeft % windowWidth + (innerProgress === -1 ? secondSpacing * windowWidth / 750 : 0)}px)
            scale(0.8)
          `,
          opacity: 1,
        });
        return;
      }

      item.setStyle({
        transform: `
          translateX(${progress *
          windowWidth *
          (1 -
            (progress >= -1
              ? firstSpacing
              : progress >= -2
                ? (firstSpacing - secondSpacing) / 2 * progress + (firstSpacing * 3 / 2 - secondSpacing / 2)
                : (firstSpacing + secondSpacing) / 2) /
            750)
          }px)
          scale(${1 - Math.abs(progress) / 10})
        `,
        opacity: `${progress + 3}`,
      });
    } else {
      item.setStyle({
        transform: '',
        opacity: 1,
      });
    }
  });

  // 触发组件的 onChange 回调
  const newCurrent = Math.round(scrollLeft / windowWidth) % total;

  if (current !== newCurrent) {
    current = newCurrent;
    // 触发组件中的 onChange 方法
    ownerComponent.callMethod('onChange', newCurrent);
  }

  if (scrollLeft % windowWidth === 0) {
    // 触发组件中的 onAnimationEnd 方法
    ownerComponent.callMethod('onAnimationEnd', newCurrent);
  }

  return false;
}

/**
 * 体验优化: 切换轮播图过程中阻止下拉刷新
 */
function handleTouchMoveEvent(event, ownerComponent) {
  const {
    scrollLeft
  } = event.instance.getDOMProperty(['scrollLeft']);
  const {
    windowWidth
  } = event.instance.getDataset();
  if (scrollLeft % windowWidth !== 0) {
    event.stopPropagation();
  }
}

/**
 * 处理滑动卡片样式
 */
const getItemStyle = (windowWidth, index) => {
  return `z-index: ${100 - index};transform: translateX(${-index *
    windowWidth *
    (1 - (-index >= -1 ? firstSpacing : -index >= -2 ? (firstSpacing - secondSpacing) / 2 * -index + (firstSpacing * 3 / 2 - secondSpacing / 2) : (firstSpacing + secondSpacing) / 2) / 750)
    }px) scale(${1 - index / 10});opacity: ${-index + 3};`;
};

/**
 * 根据内容长度计算标签容器长度
 */
function getContainerLenFromContent(content = '') {
  const contentList = content.split('\n');
  let maxLen = 0;
  for (let i = 0; i < contentList.length; i++) {
    if (contentList[i].length > maxLen) {
      maxLen = contentList[i].length;
    }
  }
  return maxLen;
}

/**
 * 删除月份数字前面 0, 例如 01 => 1
 */
function trimPrefixZero(month = '') {
  if (!month) return month;

  if (month[0] === '0') {
    return month[1];
  }

  return month;
}

export default {
  handleScrollEvent,
  handleTouchMoveEvent,
  getItemStyle,
  getContainerLenFromContent,
  trimPrefixZero,
};