export interface StartRealtimeTranscriberOption {
  sourceLanguage: string;
  translationLanguages?: string | string[];
  userIdsToTranscribe?: string | string[]; // 默认: 'all'
  transcriberRobotId?: string;
  /** 是否开启 ASR 结果云端录制，默认 false */
  enableCloudRecording?: boolean;
  /** 是否开启说话人日志，默认 false */
  enableSpeakerDiarization?: boolean;
}

export interface StopRealtimeTranscriberOption {
  transcriberRobotId: string;
}


export declare class RealtimeTranscriber {
  /** 成功时返回 robotId，可作为 stop 的 transcriberRobotId */
  start(option: StartRealtimeTranscriberOption): Promise<string>;
  stop(option: StopRealtimeTranscriberOption): Promise<void>;
}
