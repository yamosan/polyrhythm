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
    return this.sequence.progress;
  }

  public start() {
    if (this.transport.state !== "started") {
      this.transport.start();
    }
    if (this.sequence.state !== "started") {
      this.sequence.start();
    }
  }

  public stop() {
    if (this.transport.state === "started") {
      this.transport.stop();
    }
    if (this.sequence.state === "started") {
      this.sequence.stop();
    }
  }
}
