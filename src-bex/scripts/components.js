export class Component {
  constructor(name) {
    this.name = name;
  }

  init() {
    console.log(`Initializing ${this.name}`);
  }

  destroy() {
    console.log(`Destroying ${this.name}`);
  }
}

export default {
  Component
}
