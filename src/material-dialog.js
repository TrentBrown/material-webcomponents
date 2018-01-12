export default class MaterialDialog extends HTMLElement {

    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});

        shadowRoot.innerHTML = `
            <style>
                #backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--backdrop-color, rgba(128,128,128,0.5));
                    animation-name: fadein;
                    animation-duration: .2s;
                    animation-fill-mode: forwards;
                    animation-timing-function: ease-out;
                    z-index: 9999;
                }
                #modal {
                    display: grid;
                    grid-template-rows: 1fr 3fr 1fr;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: var(--dialog-width, 20%);
                    height: var(--dialog-height, auto);
                    background: #ffffff;
                    animation-name: slidedown;
                    animation-duration: .2s;
                    animation-fill-mode: forwards;
                    animation-timing-function: ease-out;
                }
                header {
                    background: var(--header-background, #ffffff);
                }
                main {
                    background: var(--body-background, #ffffff);
                }
                footer {
                    background: var(--footer-background, #ffffff);
                }
                ::slotted([slot]) {
                    margin: 10px;
                }
                
                @keyframes fadein {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes slidedown {
                    from {
                        transform: translate(-50%, -65%);
                    }
                    to {
                        transform: translate(-50%, -50%);
                    }
                }
                
                @keyframes fadeout {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
                
                @keyframes slideup {
                    from {
                        transform: translate(-50%, -50%);
                    }
                    to {
                        transform: translate(-50%, -65%);
                    }
                }
                #backdrop.close {
                    animation-name: fadeout;
                    animation-duration: .2s;
                    animation-fill-mode: forwards;
                    animation-timing-function: ease-out;
                }
                #backdrop.close #modal {
                    animation-name: slideup;
                    animation-duration: .2s;
                    animation-fill-mode: forwards;
                    animation-timing-function: ease-out;
                }
                
            </style>
            
            <div id="backdrop">
                <div id="modal">
                    <header>
                        <slot name="header"></slot>
                    </header>
                    <main>
                        <slot name="body"></slot>
                    </main>
                    <footer>
                        <slot name="footer"></slot>
                    </footer>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.style.display = 'none';
        this.backdrop = this.shadowRoot.querySelector('#backdrop');

        this.backdrop.addEventListener('click', e => {
            if(!this.hasAttribute('modal') && e.composedPath()[0] === this.backdrop) {
                this.close();
            }
        })
    }

    open() {
        this.style.display = 'block';
    }

    close() {
        this.backdrop.addEventListener('animationend', e => {
            if(e.animationName === 'fadeout') {
                this.style.display = 'none';
                this.backdrop.classList.remove('close');
            }
        });

        this.backdrop.classList.add('close');
    }
}

customElements.define('material-dialog', MaterialDialog);
