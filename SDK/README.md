<p align="center">
  <a href="https://trtc.io/">
    <img width="200" src="https://web.sdk.qcloud.com/trtc/webrtc/assets/trtc.io-logo.png">
  </a>
</p>

<h1 align="center" style="margin-top: -40px">TRTC Web SDK</h1>

<div align="center">

An object-oriented WebRTC SDK library  

[![NPM version](https://img.shields.io/npm/v/trtc-sdk-v5)](https://www.npmjs.com/package/trtc-sdk-v5) [![NPM downloads](https://img.shields.io/npm/dw/trtc-sdk-v5)](https://www.npmjs.com/package/trtc-sdk-v5) [![trtc.js](https://img.shields.io/bundlephobia/min/trtc-sdk-v5)](https://www.npmjs.com/package/trtc-sdk-v5) [![Typescript Supported](https://img.shields.io/badge/Typescript-Supported-blue)](https://www.npmjs.com/package/trtc-sdk-v5) [![Documents](https://img.shields.io/badge/-Documents-blue)](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/index.html) [![Stars](https://img.shields.io/github/stars/tencentyun/TRTCSDK?style=social)](https://github.com/LiteAVSDK/TRTC_Web) 

</div>

<div align="center"> English | <a href="https://github.com/LiteAVSDK/TRTC_Web/blob/main/README-zh_CN.md" target="_blank"> 简体中文</a> </div>

## Introduction

TRTC Web SDK is an object-oriented WebRTC SDK of Tencent Cloud's real-time communication solution. Web developers can use TRTC Web SDK to establish an audio/video calls or live streaming services on your website.

- [Online Demo](https://trtc.io/demo/homepage/#/home).
- [Changelog](https://trtc.io/document/53626).
- We offer SDKs for Web, Android, iOS, Windows, Flutter, explore more in [trtc.io](https://trtc.io/).

## Environment Supports

TRTC Web SDK supports major modern browsers. For details, please refer to [Browsers Supported](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-05-info-browser.html).

| [<img src="https://web.sdk.qcloud.com/trtc/webrtc/assets/logo/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://web.sdk.qcloud.com/trtc/webrtc/assets/logo/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> Edge | [<img src="https://web.sdk.qcloud.com/trtc/webrtc/assets/logo/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://web.sdk.qcloud.com/trtc/webrtc/assets/logo/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://web.sdk.qcloud.com/trtc/webrtc/assets/logo/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>iOS Safari | [<img src="https://web.sdk.qcloud.com/trtc/webrtc/assets/logo/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- |
| 56+ | 80+ | 56+ | 11+ | 11+ | 46+ |

## Install

npm:
```
$ npm install trtc-sdk-v5 --save
```

yarn:
```
$ yarn add trtc-sdk-v5
```

Download manually：

1. download [trtc.js](https://www.unpkg.com/trtc-sdk-v5@latest/trtc.js).
2. copy `trtc.js` to your project.

## Usage

Refer to the following two tutorials for a quick run-through of the demo and how to use the SDK to implement basic audio and video calling functionality.

- [Demo Quick Run](https://trtc.io/document/35607).
- [Integration Quick Start](https://trtc.io/document/35096).

Explore SDK API documents：[TRTC Web SDK](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/index.html).

## API Overview

- [TRTC](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html) is the main entry for TRTC SDK, providing APIs such as create trtc instance([TRTC.create](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#.create)), [TRTC.getCameraList](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#.getCameraList), [TRTC.getMicrophoneList](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#.getMicrophoneList),  [TRTC.isSupported](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#.isSupported).
- [trtc](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html) instance, provides the core capability for real-time audio and video calls.
  - Enter room [trtc.enterRoom](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#enterRoom)
  - Exit room [trtc.exitRoom](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#exitRoom)
  - Turn on camera [trtc.startLocalVideo](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalVideo)
  - Turn on microphone [trtc.startLocalAudio](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalAudio)
  - Turn off camera [trtc.stopLocalVideo](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#stopLocalVideo)
  - Turn off microphone [trtc.stopLocalAudio](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#stopLocalAudio)
  - Play remote video [trtc.startRemoteVideo](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startRemoteVideo)
  - Stop playing remote video [trtc.stopRemoteVideo](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#stopRemoteVideo)
  - Mute/unmute remote audio [trtc.muteRemoteAudio](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#muteRemoteAudio)

## Directory

```
├── README.md
├── package.json
├── trtc.js // sdk file(umd format)
├── trtc.esm.js // sdk file base on ES modules(esm format)
├── index.d.ts // ts declaration file
├── plugins // sdk plugins
└── assets // static resource directory (e.g., required for features like virtual background, AI noise reduction, etc., which need to be deployed on the server for the SDK to dynamically load resources)
```