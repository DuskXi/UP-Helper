import {Follower} from "app/src-bex/service/follower";
import {DirectStorage} from "app/src-bex/service/directStorage";

class ServiceLoader {

  constructor() {
    this.services = [];
    this.servicesClasses = [Follower, DirectStorage];
  }

  loadServices() {
    this.servicesClasses.forEach(serviceClass => {
      let service = new serviceClass();
      service.init().then(r => null);
      this.services.push(service);
    });
  }

}

export {
  ServiceLoader
}
