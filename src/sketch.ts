import type p5 from "p5";
import { lcm } from "./util";
import { Beat } from "./beat";
import { Rhythm } from "./rhythm";
import Color from "colorjs.io";

export function sketch(p: p5) {
  const subdivision = [4, 3];
  const notes = ["E4", "C4", "G4"];
  const colors = [
    new Color("sRGB", [237, 37, 78]),
    new Color("sRGB", [249, 220, 92]),
    new Color("sRGB", [194, 234, 189]),
    new Color("sRGB", [1, 25, 54]),
    new Color("sRGB", [70, 83, 98]),
  ];

  let circle: Circle;
  let polygons: Polygon[];
  let beat: Beat;
  let rhythms: Rhythm[];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    init();
  };

  p.draw = () => {
    const progress = beat.progress;
    p.background(0);
    p.fill(255);

    polygons.forEach((p) => {
      p.updateProgress(progress);
      p.draw();
    });

    circle.draw();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    initObjects();
  };

  function init() {
    initObjects();
    initInstruments();
  }

  function initObjects() {
    const rad = Math.min(p.windowWidth, p.windowHeight) * 0.8;
    const center = p.createVector(p.width / 2, p.height / 2);
    polygons = subdivision.map(
      (d, i) => new Polygon(p, center.x, center.y, rad, d, colors[i])
    );
    circle = new Circle(p, center.x, center.y, rad, lcm(...subdivision));
  }

  function initInstruments() {
    beat = new Beat(120);
    beat.start();
    rhythms = subdivision.map((d, i) => new Rhythm(d, notes[i]));
    rhythms.forEach((r) => r.start());
  }
}

class Circle {
  constructor(
    private p: p5,
    public x: number,
    public y: number,
    public r: number,
    public grid: number
  ) {}

  draw() {
    this.p.noFill();
    this.drawCircle();
    this.drawRuler(this.grid, 4);
  }
  private drawCircle() {
    this.p.stroke(255);
    this.p.strokeWeight(1);
    this.p.ellipse(this.x, this.y, this.r, this.r);
  }
  private drawRuler(seg: number, len: number) {
    this.p.fill(0);
    this.p.strokeWeight(1);
    for (let i = 0; i < seg; i++) {
      const angle = this.p.map(i, 0, seg, 0, this.p.TWO_PI);
      const x = this.x + (this.r * this.p.sin(angle)) / 2;
      const y = this.y - (this.r * this.p.cos(angle)) / 2;
      const x1 = x + len * this.p.sin(angle);
      const y1 = y - len * this.p.cos(angle);
      const x2 = x - len * this.p.sin(angle);
      const y2 = y + len * this.p.cos(angle);
      this.p.line(x1, y1, x2, y2);
    }
  }
}

class Polygon {
  readonly threshold: number;
  isNearEdge: boolean;
  position: p5.Vector;

  constructor(
    private p: p5,
    public x: number,
    public y: number,
    public r: number,
    public div: number,
    public color: Color = new Color("rgb", [255, 255, 255])
  ) {
    this.threshold = 0.1;
    this.isNearEdge = false;
    this.position = this.p.createVector(0, 0);
    this.updateProgress(0);
  }

  updateProgress(progress: number) {
    if (progress < 0 || progress > 1) {
      throw new Error("progress must be in the range [0, 1]");
    }

    const timePerEdge = 1 / this.div;
    const edgeIndex = Math.floor(progress / timePerEdge);
    const localT = (progress % timePerEdge) / timePerEdge;

    const vertices = this.calculatePolygonVertices();
    const startPoint = vertices[edgeIndex];
    const endPoint = vertices[(edgeIndex + 1) % this.div];

    const x = this.p.map(localT, 0, 1, startPoint.x, endPoint.x);
    const y = this.p.map(localT, 0, 1, startPoint.y, endPoint.y);

    if (localT < this.threshold || localT > 1 - this.threshold) {
      this.isNearEdge = true;
    } else {
      this.isNearEdge = false;
    }
    this.position = this.p.createVector(x, y);
  }

  draw() {
    this.drawTrack();
    this.drawPoint();
  }

  drawPoint() {
    this.p.noStroke();

    this.p.fill(this.color.coords);
    this.p.ellipse(this.position.x, this.position.y, 20, 20);
  }
  drawTrack() {
    const color = this.color.clone();
    if (!this.isNearEdge) {
      color.darken(0.5);
    }

    this.p.stroke(color.coords);
    this.p.strokeWeight(4);
    this.p.noFill();
    this.p.beginShape();

    const vertices = this.calculatePolygonVertices();
    vertices.forEach((v) => {
      this.p.vertex(v.x, v.y);
    });
    this.p.endShape(this.p.CLOSE);
  }

  private calculatePolygonVertices(): p5.Vector[] {
    const vertices: p5.Vector[] = [];
    for (let i = 0; i < this.div; i++) {
      const angle = this.p.map(i, 0, this.div, 0, this.p.TWO_PI);
      const x = this.x + (this.r * this.p.sin(angle)) / 2;
      const y = this.y - (this.r * this.p.cos(angle)) / 2;
      vertices.push(this.p.createVector(x, y));
    }
    return vertices;
  }
}
