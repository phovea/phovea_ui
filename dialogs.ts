/**
 * Created by Samuel Gratzl on 19.11.2015.
 */
/// <reference path="../../tsd.d.ts" />
/// <amd-dependency path="bootstrap" />
import $ = require('jquery');

function generateDialog(title: string) {
  const dialog = document.createElement('div');
  dialog.setAttribute('role','dialog');
  dialog.classList.add('modal','fade');
  dialog.innerHTML = `
     <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span class="glyphicon glyphicon-remove-sign" title="Close"></span></button>
          <h4 class="modal-title">${title}</h4>
        </div>
        <div class="modal-body">

        </div>
      </div>
    </div>`;
  document.body.appendChild(dialog);
  const $dialog = (<any>$(dialog));
  return {
    show: () => $dialog.modal('show'),
    hide: () => $dialog.modal('hide'),
    body: <HTMLElement>dialog.querySelector('.modal-body'),
    onHide: (callback: ()=>void) => $dialog.on('hidden.bs.modal', callback),
    destroy: () => $dialog.remove()
  };
}

export function msg(text: string, category='info'): Promise<void> {
  return new Promise<void>((resolve) => {
    const div = $(`<div class="alert alert-${category} alert-dismissible fade in" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span class="glyphicon glyphicon-remove-sign" title="Close"></span></button>
        ${text}
    </div>`).appendTo('body');
    div.on('closed.bs.alert', resolve);
    (<any>div).alert();
  });
}

/**
 * simple prompt dialog
 * @param text
 * @param title
 * @returns {Promise}
 */
export function prompt(text: string, title: string = 'Input'): Promise<string> {
  return new Promise((resolve) => {
    var dialog = generateDialog(title);
    dialog.body.innerHTML = `<form><input type="text" class="form-control" value="${text}"></form>`;
    (<HTMLFormElement>dialog.body.querySelector('form')).onsubmit = () => {
      dialog.hide();
      return false;
    };
    dialog.onHide(() => {
      resolve((<HTMLInputElement>dialog.body.querySelector('input')).value);
      dialog.destroy();
    });
    dialog.show();
  })
}
