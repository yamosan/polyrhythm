import p5 from "p5";
import "./style.css";
import { sketch } from "./sketch";
import { getContext } from "tone";

const canvas = document.getElementById("root");
if (!canvas) {
  throw new Error("Canvas not found");
}

let isLoaded = false;
document.addEventListener("click", async () => {
  if (!isLoaded) {
    isLoaded = true;
    const context = getContext();
    if (context.state !== "running") {
      await context.resume();
    }
    new p5(sketch, canvas);
  }
});

document.addEventListener("touchmove", (e) => e.preventDefault(), {
  passive: false,
});
document.addEventListener("mousewheel", (e) => e.preventDefault(), {
  passive: false,
});
