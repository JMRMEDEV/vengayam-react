class TaskList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = this.getInnerHTML();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  getInnerHTML() {
    return /*html*/ `
      <!-- Main container -->
      <div id="component-container" class="task-list" style="height: 100%; border-radius: 5px; padding: 0px 10px 10px 10px; display: flex; flex-direction: column; justify-content: space-around;">
          <div style="margin: 20px; padding-bottom: 10px; display: flex; justify-content: space-between; border-bottom: thin dashed gray;">
              <li> Update the username and password </li>
              <div style="display: flex; justify-content: space-evenly">
                  <button id="accpt1"; style="border-color: black; border-radius: 4px; background-color: #6fc0ec"> Accept </button>
                  <button style="border-color: black; border-radius: 4px; background-color: #df9598;  margin-left: 10px"> Reject </button>
              </div>
          </div>
          <div style="margin: 20px; padding-bottom: 10px; display: flex; justify-content: space-between; border-bottom: thin dashed gray;">
              <li> Update your address before 29th Nov 2022 </li>
              <div style="display: flex; justify-content: space-evenly">
                  <button style="border-color: black; border-radius: 4px; background-color: #6fc0ec"> Accept </button>
                  <button style="border-color: black; border-radius: 4px; background-color: #df9598; margin-left: 10px"> Reject </button>
              </div>
          </div>
          <div style="margin: 20px; padding-bottom: 10px; display: flex; justify-content: space-between; border-bottom: thin dashed gray;">
              <li> Update the username and password </li>
              <div style="display: flex; justify-content: space-evenly">
                  <button style="border-color: black; border-radius: 4px; background-color: #6fc0ec"> Accept </button>
                  <button style="border-color: black; border-radius: 4px; background-color: #df9598; margin-left: 10px"> Reject </button>
              </div>
          </div>
      </div>`;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.getElementsByClassName("task-list");
  }
}

customElements.get("task-list") ||
  window.customElements.define("task-list", TaskList);
