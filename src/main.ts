import p5 from "p5";
import "./style.css";
import { sketch } from "./sketch";

const canvas = document.getElementById("root");
if (!canvas) {
  throw new Error("Canvas not found");
}

new p5(sketch, canvas);
document.addEventListener("touchmove", (e) => e.preventDefault(), {
  passive: false,
});
document.addEventListener("mousewheel", (e) => e.preventDefault(), {
  passive: false,
});
