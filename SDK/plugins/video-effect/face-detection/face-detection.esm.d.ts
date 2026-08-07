export interface FaceDetectionOptions {
  /** 人脸检测状态变化的回调函数 */
  onFaceDetectionStateChanged: (hasFace: boolean) => void;
  /** 两次推理执行的最小间隔，单位 ms，默认 300，范围 [100, 5000]。该值同时控制推理频率和回调节流 */
  detectionInterval?: number;
  /** 人脸检测最小置信度，默认 0.8，范围 [0, 1] */
  minConfidence?: number;
  /** 人脸消失后等待多久才触发状态变为 false 的回调，单位 ms，默认 1000，范围 [0, 5000] */
  missingTimeout?: number;
}

export interface UpdateFaceDetectionOptions {
  /** 人脸检测状态变化的回调函数 */
  onFaceDetectionStateChanged?: (hasFace: boolean) => void;
  /** 两次推理执行的最小间隔，单位 ms，默认 300，范围 [100, 5000] */
  detectionInterval?: number;
  /** 人脸检测最小置信度，默认 0.8，范围 [0, 1] */
  minConfidence?: number;
  /** 人脸消失后等待多久才触发状态变为 false 的回调，单位 ms，默认 1000，范围 [0, 5000] */
  missingTimeout?: number;
}

export declare class FaceDetection {
  static isSupported(): boolean;
  start(options: FaceDetectionOptions): Promise<void>;
  update(options: UpdateFaceDetectionOptions): Promise<void>;
  stop(): Promise<void>;
}

export default FaceDetection;
