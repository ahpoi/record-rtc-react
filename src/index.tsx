import * as React from "react";
import {useEffect} from "react";
import * as ReactDOM from "react-dom";
import {Button, DefaultAppTheme, GlobalStyle, Horizontal, PageBody, PageRoot, VerticalSpacer} from "startify-ui";
// @ts-ignore
import {ThemeProvider} from "styled-components";
// @ts-ignore
import * as RecordRTC from "recordrtc";
import {invokeSaveAsDialog} from "./utils/utils";

const Page = ({ children }: { children: React.ReactNode }) =>
    <PageRoot>
      <PageBody>
        {children}
      </PageBody>
    </PageRoot>;

const ScreenRecordingPage = () => {

  const [recorder, setRecorder] = React.useState();
  const [stream, setStream] = React.useState<MediaStream>();

  const onRecord = async () => {
    const stream = await startCapture();
    const recorder = RecordRTC(stream, { type: "video" });
    recorder.startRecording();
    setRecorder(recorder);
    setStream(stream);
  };

  const onStop = async () => {
    recorder.stopRecording(() => {
      const blob = recorder.getBlob();
      const file = new File([blob], new Date().getTime().toString(), { type: "video/webm" });
      invokeSaveAsDialog(file, file.name);
    });
    stream?.getTracks().forEach(track => track.stop());
    setStream(stream);
  };

  return <Page>
    <Horizontal>
      <Button onClick={onRecord}>Start Sharing</Button>
      <Button variant={"secondary"} onClick={onStop}>Stop Recording</Button>
    </Horizontal>
    <VerticalSpacer/>
    <ScreenRealtimePreview stream={stream}/>
  </Page>;
};

export const startCapture = (): MediaStream => {
  const options = {
    video: true,
    audio: true
  };
  const nav = navigator as any;
  if (nav.mediaDevices.getDisplayMedia) {
    return nav.mediaDevices.getDisplayMedia(options);
  } else {
    return nav.getDisplayMedia(options);
  }
};

const ScreenRealtimePreview = ({ stream }: { stream?: MediaStream }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream as any;
      videoRef.current.play();
    }
  }, [stream]);
  return <video preload={"none"} autoPlay={false} style={{ maxWidth: 900 }} ref={videoRef}/>;
};

ReactDOM.render(
    <React.StrictMode>
      <GlobalStyle fontFamily={"Montserrat,Helvetica Neue,HelveticaNeue,Helvetica,Arial,sans-serif"}/>
      <ThemeProvider theme={DefaultAppTheme}>
        <ScreenRecordingPage/>
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
);


