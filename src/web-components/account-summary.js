const colors = {
  svbBlue: {
    darker: "#10466a",
    dark: "#1164a8",
    medium: "#2b70b6",
    mediumLighter: "#3f80bd",
    light: "#6fc0ec"
  },
  gray: {
    light: "#fafafa",
    darker: "#e0e0e0",
    dark: "#6d6e6d"
  }
};

class AccountSummary extends HTMLElement {
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
      <div id="component-container" class="account-summary" style="margin: 15px; height: 100%; border-radius: 5px; padding: 0px 10px 10px 10px;">
          <div style="display: flex; justify-content: space-between">
              <h4 style="color: #2b70b6;"> Available Balance <h4>
              <h4> 14678 USD </h4>
          </div>

          <div style="display: flex; justify-content: space-between">
              <div style="display: flex;">
                  <svg width="16" height="16" style="margin-top: 15px;">
                      <circle cx="10" cy="10" r="5" fill=${colors.svbBlue.light} />
                  </svg>
                  <div style="display: flex; flex-direction: column;">
                      <p style="padding-left: 4px;">Total Cash In</p>
                      <p> +5678 USD </p>
                  </div>
              </div>
              <div style="display: flex;">
                  <svg width="16" height="16" style="margin-top: 15px;">
                      <circle cx="10" cy="10" r="5" fill=${colors.svbBlue.dark} />
                  </svg>
                  <div style="display: flex; flex-direction: column;">
                      <p style="padding-left: 4px;">Total Cash Out</p>
                      <p> -1276 USD </p>
                  </div>
              </div>
          </div>
          <div style="margin: 5px; display: flex; justify-content: space-between; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
              <p style="padding-left: 10px"> RTP transaction Honey well <p>
              <p style="padding-right: 10px"> -$356 </p>
          </div>
          <div style="margin: 5px; display: flex; justify-content: space-between; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
              <p style="padding-left: 10px"> Wire credit transfer <p>
              <p style="padding-right: 10px"> +$1356 </p>
          </div>
      </div>`;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.getElementsByClassName("account-summary");
  }
}

customElements.get("account-summary") ||
  window.customElements.define("account-summary", AccountSummary);
