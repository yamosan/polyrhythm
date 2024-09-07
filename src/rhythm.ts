import { PolySynth, Sequence } from "tone";
import { range } from "./util";

export class Rhythm {
  private sequence: Sequence;
  private synth: PolySynth;
  constructor(
    private readonly subdivision: number,
    private readonly note: string
  ) {
    this.synth = new PolySynth().toDestination();
    this.synth.set({
      volume: -4,
      oscillator: {
        type: "triangle17",
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.2,
        release: 1.7,
      },
    });
    this.sequence = new Sequence({
      callback: (time) => {
        this.synth.triggerAttackRelease(this.note, "16n", time);
      },
      events: range(subdivision),
      subdivision: `${this.subdivision}n`,
    });
  }

  public get progress() {
    return this.sequence.progress;
  }

  public start() {
    if (this.sequence.state !== "started") {
      this.sequence.start();
    }
  }

  public stop() {
    if (this.sequence.state === "started") {
      this.sequence.stop();
    }
  }
}
