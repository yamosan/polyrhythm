import { getTransport, Sequence } from "tone";
import { range } from "./util";

// tone から export されていないため定義
type Transport = ReturnType<typeof getTransport>;

export class Beat {
  private transport: Transport;
  private sequence: Sequence;

  constructor(bpm: number) {
    this.transport = getTransport();
    this.transport.bpm.value = bpm;
    this.sequence = new Sequence({
      callback: () => {},
      events: range(4),
      subdivision: "4n",
    });
  }

  public get bpm() {
    return this.transport.bpm.value;
  }
  public set bpm(value: number) {
    this.transport.bpm.value = value;
  }

  public get progress() {
    // FIXME: transport.progress が 0のままなので
    return this.sequence.progress;
  }

  public get active() {
    return this.transport.state === "started";
  }

  public start() {
    this.sequence.start();
    this.transport.start();
  }

  public stop() {
    this.transport.stop();
  }

  public pause() {
    this.transport.pause();
  }
}
