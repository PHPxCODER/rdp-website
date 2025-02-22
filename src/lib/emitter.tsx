import mitt from "mitt";

type Events = {
  proBannerVisibilityChange: "hidden" | "visible";
  proBannerForceShow: void; 
};

const emitter = mitt<Events>();

export default emitter;