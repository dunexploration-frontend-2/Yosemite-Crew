import * as React from 'react';
import {View} from 'react-native';
import Svg, {
  Path,
  G,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import {getCirclePosition} from '../../utils/constants';
import {scaledValue} from '../../utils/design.utils';

const HalfCircleProgress = ({percent = 0, ...props}) => {
  const {x, y} = getCirclePosition(percent);
  return (
    <View style={{overflow: 'hidden', height: scaledValue(60)}}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={scaledValue(118.25)}
        height={scaledValue(60)} // cropped height
        viewBox="0 14 118.25 60" // start from Y=14 to crop top arc cleanly
        fill="none"
        {...props}>
        <Path
          d="M114.7 73.124C116.66 73.124 118.259 71.5343 118.142 69.5786C117.748 63.0267 116.265 56.5775 113.747 50.4982C110.776 43.3249 106.421 36.8072 100.931 31.317C95.4407 25.8268 88.923 21.4718 81.7497 18.5005C74.5765 15.5293 66.8882 14 59.1239 14C51.3597 14 43.6714 15.5293 36.4982 18.5005C29.3249 21.4718 22.8072 25.8268 17.317 31.317C11.8268 36.8072 7.4718 43.3249 4.50054 50.4982C1.98241 56.5775 0.499975 63.0267 0.10639 69.5786C-0.0110911 71.5343 1.58824 73.124 3.54744 73.124C5.50663 73.124 7.08228 71.5339 7.21576 69.5792C7.59951 63.9597 8.89384 58.4316 11.0554 53.2133C13.6701 46.9008 17.5025 41.1652 22.3338 36.3338C27.1652 31.5025 32.9008 27.6701 39.2133 25.0554C45.5257 22.4406 52.2914 21.0949 59.1239 21.0949C65.9565 21.0949 72.7222 22.4406 79.0346 25.0554C85.3471 27.6701 91.0827 31.5025 95.9141 36.3338C100.745 41.1652 104.578 46.9008 107.193 53.2133C109.354 58.4316 110.648 63.9597 111.032 69.5792C111.166 71.5338 112.741 73.124 114.7 73.124Z"
          fill="url(#paint0_linear_2177_5074)"
        />
        <G>
          <Circle
            cx={x}
            cy={y}
            r={10.44869}
            fill="#FFFEFE"
            strokeWidth={1}
            stroke={'#247AED'}
          />
        </G>
        <Defs>
          <LinearGradient
            id="paint0_linear_2177_5074"
            x1={3.32572}
            y1={70.1677}
            x2={118.248}
            y2={73.1239}
            gradientUnits="userSpaceOnUse">
            <Stop stopColor="#E0EFFF" />
            <Stop offset={0.5} stopColor="#007AFF" />
            <Stop offset={1} stopColor="#003D80" />
          </LinearGradient>
        </Defs>
      </Svg>
    </View>
  );
};

export default HalfCircleProgress;
