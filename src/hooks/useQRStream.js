import { useCallback, useMemo, useRef, useState } from 'react';
import { assembleQRFrames, createQRFrames, parseFramePayload, PROTOCOL_CONSTANTS } from '../utils/protocol.js';

export const useQRStream = (content = '') => {
  return useMemo(() => createQRFrames(content), [content]);
};

export const useQRFrameCollector = ({ onComplete, onError }) => {
  const framesRef = useRef(new Map());
  const [progress, setProgress] = useState({ total: 0, received: 0, hash: null });

  const submitFrame = useCallback(
    (payload) => {
      try {
        const frame = parseFramePayload(payload);
        if (!framesRef.current.has(frame.i)) {
          framesRef.current.set(frame.i, payload);
          setProgress({
            total: frame.t,
            received: framesRef.current.size,
            hash: frame.H
          });
        }
        if (framesRef.current.size === frame.t) {
          const result = assembleQRFrames(new Map(framesRef.current));
          onComplete?.(result.text, result);
        }
      } catch (error) {
        onError?.(error);
      }
    },
    [onComplete, onError]
  );

  const reset = useCallback(() => {
    framesRef.current.clear();
    setProgress({ total: 0, received: 0, hash: null });
  }, []);

  return {
    framesRef,
    progress,
    submitFrame,
    reset,
    frameInterval: PROTOCOL_CONSTANTS.FRAME_INTERVAL_MS
  };
};
