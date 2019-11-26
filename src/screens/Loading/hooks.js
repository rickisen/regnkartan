import { useEffect, useState, useRef } from "react";
import { Animated } from "react-native";
import { useSelector } from "react-redux";

import { selectReqsMeanProgress } from "../../redux/modules/watchedRequests";

/**
 * @param {number} duration
 * @return {object} Animation
 */
export function useEntryAnimation({ duration }) {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  }, []);

  return animation;
}

/**
 * @return {number} meanProgress
 */
export function useMeanProgress() {
  let meanProgress = useSelector(selectReqsMeanProgress);
  if (isNaN(meanProgress)) {
    meanProgress = 0;
  }
  return meanProgress;
}

/**
 * @param {function} navigate
 * @param {number} meanProgress
 * @param {string} destination - Name of screen to navigate to
 * @return {void}
 */
export function useDelayedNavigationOnProgress(
  navigate = () => {},
  meanProgress = 0,
  destination = "Radar"
) {
  const ref = useRef(null);
  useEffect(() => {
    if (meanProgress === 100) {
      clearTimeout(ref.current);
      ref.current = setTimeout(() => {
        navigate(destination);
      }, 1000);
    }
  }, [meanProgress, navigate]);
}
