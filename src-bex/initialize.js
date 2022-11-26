import {TabManager} from "./scripts/tab";
import {VideoInformation} from "./scripts/components/VideosInformation";
import {Space} from "./scripts/components/Space";
import {ServiceLoader} from "app/src-bex/service/loader";
import {MultipleFileInjection} from "app/src-bex/scripts/components/MultipleFileInjection";

export function run() {
  let tabManager = new TabManager();
  let componentsClass = [{class: VideoInformation, arguments: [tabManager]}, {class: Space, arguments: [tabManager]}, {class: MultipleFileInjection, arguments: [tabManager]}];
  let components = loadComponents(componentsClass);
  loadServices();
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

function loadServices() {
  let serviceLoader = new ServiceLoader();
  serviceLoader.loadServices();
}
