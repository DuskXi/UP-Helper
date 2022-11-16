import {TabManager} from "./scripts/tab";
import {VideoInformation} from "./scripts/components/VideosInformation";

export function run() {
  let tabManager = new TabManager();
  let componentsClass = [{class: VideoInformation, arguments: [tabManager]}];
  let components = loadComponents(componentsClass);
}

/**
 *
 * @param {[]} components
 */

function loadComponents(components) {
  let componentsObjet = [];
  components.forEach(component => {
    let instance = new component.class(...component.arguments);
    instance.init();
    componentsObjet.push({name: component.name, object: instance});
  });
  return componentsObjet;
}
