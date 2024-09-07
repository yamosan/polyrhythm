import { getTransport } from "tone";

// tone から export されていないため定義
type Transport = ReturnType<typeof getTransport>;

export class Beat {
  private transport: Transport;

  constructor(bpm: number) {
    this.transport = getTransport();
    this.transport.bpm.value = bpm;
    this.transport.loop = true;
    this.transport.setLoopPoints(0, "1m"); // 1小節でループ
  }

  public get bpm() {
    return this.transport.bpm.value;
  }
  public set bpm(value: number) {
    this.transport.bpm.value = value;
  }

  public get progress() {
    // 1以上を返すことがあるため補正
    return Math.min(Math.max(this.transport.progress, 0), 1);
  }

  public get active() {
    return this.transport.state === "started";
  }

  public start() {
    this.transport.start();
  }

  public stop() {
    this.transport.stop();
  }

  public pause() {
    this.transport.pause();
  }
}
