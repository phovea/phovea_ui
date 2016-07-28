/**
 * Created by Samuel Gratzl on 24.11.2014.
 */
/// <amd-dependency path="bootstrap" />
/// <amd-dependency path="css!./style.css"/>
/// <amd-dependency path="text!./_header.html" name="template"/>
declare var template:string;

import ajax = require('../caleydo_core/ajax');
import C = require('../caleydo_core/main');
import $ = require('jquery');

export interface IHeaderLink {
  name: string;
  action: () => any;
  href: string;
}

export class AppHeaderLink implements IHeaderLink {
  public name: string = 'Caleydo Web';
  public action: () => any = () => false;
  public href:string = '#';
  public addLogo:boolean = true;

  constructor(name?, action?, href?, addLogo?) {
    if(name) {
      this.name = name;
    }

    if(action) {
      this.action = action;
    }

    if(href) {
      this.href = href;
    }

    if(addLogo) {
      this.addLogo = addLogo;
    }
  }
}

function createLi(name:string, action:() => any, href = '#') {
  const li = <HTMLElement>document.createElement('li');
  li.innerHTML = '<a href="' + href + '">' + name + '</a>';
  if (action) {
    (<HTMLElement>li.querySelector('a')).onclick = action;
  }
  return li;
}

export class AppHeader {
  private _options = {
    prepend : true,
    //app: 'Caleydo Web', //DEPRECATED use `appLink.name` instead
    //addLogo: true, //DEPRECATED use `appLink.addLogo` instead
    appLink: new AppHeaderLink(),
    mainMenu: new Array<IHeaderLink>(),
    rightMenu: new Array<IHeaderLink>(),
    inverse: true
  };

  mainMenu:HTMLElement;
  rightMenu:HTMLElement;

  about:HTMLElement;
  options:HTMLElement;

  constructor(private parent:HTMLElement, options:any = {}) {
    C.mixin(this._options, options);

    // legacy support
    if(options.app !== undefined && options.appLink === undefined) {
      this._options.appLink.name = options.app;
    }
    if(options.addLogo !== undefined && !options.appLink === undefined) {
      this._options.appLink.addLogo = options.addLogo;
    }

    //create the content and copy it in the parent
    const helper = document.createElement('div');
    helper.innerHTML = template;
    let old = parent.firstChild;
    if (this._options.prepend && old) {
      while (helper.firstChild) {
        parent.insertBefore(helper.firstChild, old);
      }
    } else {
      while (helper.firstChild) {
        parent.appendChild(helper.firstChild);
      }
    }

    if (this._options.inverse) {
      (<HTMLElement>document.querySelector('nav.navbar')).classList.add('navbar-inverse');
    }

    //create handler
    const app = (<HTMLElement>parent.querySelector('*[data-header="app"]'));

    app.innerHTML = this._options.appLink.name;
    app.onclick = this._options.appLink.action;
    app.setAttribute('href', this._options.appLink.href);

    if (this._options.appLink.addLogo) {
       app.classList.add('caleydo_app');
    }

    this.mainMenu = <HTMLElement>parent.querySelector('*[data-header="main"]');
    this.rightMenu = <HTMLElement>parent.querySelector('*[data-header="rightmenu"]');
    this.about = <HTMLElement>parent.querySelector('*[data-header="about"]');
    this.options = <HTMLElement>parent.querySelector('*[data-header="options"]');

    Promise.resolve(ajax.getAPIJSON(`/last_deployment`, {})).then((msg) => {
      if(msg.timestamp) {
        this.about.querySelector('.lastDeployment span').textContent = new Date(msg.timestamp).toUTCString();
      }
    });

    this._options.mainMenu.forEach((l) => this.addMainMenu(l.name, l.action, l.href));
    this._options.rightMenu.forEach((l) => this.addRightMenu(l.name, l.action, l.href));
  }

  addMainMenu(name:string, action:() => any, href = '#') {
    const li = createLi(name, action, href);
    this.mainMenu.appendChild(li);
    return li;
  }

  insertCustomMenu(element: Element) {
    this.rightMenu.parentElement.insertBefore(element, this.rightMenu);
  }

  insertCustomRightMenu(element: Element) {
    this.rightMenu.parentElement.appendChild(element);
  }

  addRightMenu(name:string, action:() => any, href = '#') {
    const li = createLi(name, action, href);
    this.rightMenu.insertBefore(li, this.rightMenu.firstChild);
    return li;
  }

  wait() {
    $('#headerWaitingOverlay').fadeIn();
  }

  ready() {
    $('#headerWaitingOverlay').fadeOut();
  }
}

export function create(parent:HTMLElement, options:any = {}) {
  return new AppHeader(parent, options);
}
