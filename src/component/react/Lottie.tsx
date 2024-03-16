// #region docs
import React from 'react';
import lottie,  { type AnimationItem } from 'lottie-web';

type RendererType = 'svg' | 'canvas' | 'html';

interface LottieProps {
  // 是否循环播放
  loop?: boolean;
  // 渲染动画的类型
  renderer?: RendererType;
  // 是否自动播放
  autoplay?: boolean;
  // 动画渲染数据，与path互斥
  animationData?: any;
  // JSON文件路径，与animationData互斥
  path?: string;
  // 动画名称
  name?: string;
}

/**
 * 封装 lottie 函数组件
 */
const Lottie = React.forwardRef<
  {
    getInstance: () => AnimationItem | null;
    play: () => void;
    pause: () => void;
    stop: () => void;
  },
  LottieProps
>((props, ref) => {
  // 设置props的默认值
  const { loop = true, renderer = 'svg', path = '', animationData, autoplay = true, name = 'anim' } = props;
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const animationItemRef = React.useRef<AnimationItem | null>(null);
  // 暴露给从 props 传入的 ref 的方法
  React.useImperativeHandle(ref, () => ({
    // 获取当前动画对象实例
    getInstance: () => animationItemRef.current,
    // 播放，继续播放
    play: () => {
      animationItemRef.current?.play();
    },
    // 暂停动画
    pause: () => {
      animationItemRef.current?.pause();
    },
    // 停止动画，区别于暂停动画 pause()
    stop: () => {
      animationItemRef.current?.stop();
    },
  }));

  // 缓存 lottie 动画参数
  const animationParams = React.useMemo(
    () =>
      animationData ? { name, autoplay, loop, renderer, animationData } : { name, autoplay, loop, renderer, path },
    [loop, renderer, autoplay, path, animationData, name]
  );

  React.useEffect(() => {
    if (containerRef.current) {
      animationItemRef.current = lottie.loadAnimation({
        ...animationParams,
        container: containerRef.current,
      });
    }
    return () => {
      // 更新动画参数和卸载时，销毁动画对象，避免内存泄漏
      animationItemRef.current?.destroy();
      animationItemRef.current = null;
    };
  }, [animationParams]);
  return (
    // 渲染容器
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}></div>
  );
});

export default Lottie;

// #endregion docs
