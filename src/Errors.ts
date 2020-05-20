import {Dialog} from './dialogs';
import i18n from 'phovea_core/src/i18n';

let globalErrorTemplate = (details: string) => details;

export class Errors {
  /**
   * sets the template function for generating the error details in a error dialog
   * @param {(details: string) => string} template
   */
  static setGlobalErrorTemplate(template: (details: string) => string) {
    globalErrorTemplate = template;
  }

  /**
   * Use this modal dialog to show errors that were catched when an XHR request in a promise fails.
   * The dialog returns a promise that is resolved when the dialog is closed.
   * You can use that to clean up things in an error case.
   *
   * Usage:
   * ```
   * Promise(...)
   * .then(() => { ... }) //success
   * .catch(showErrorModalDialog) // open error dialog
   * .then((xhr) => { ... }); // do something after the error dialog has been closed
   * ```
   *
   * @param error
   * @returns {Promise<any>|Promise}
   */
  static showErrorModalDialog(error: any, additionalCSSClasses: string = '') {
    function commonDialog(title: string, body: string) {
      // lazy import
      return System.import('./dialogs').then(({generateDialog}: {generateDialog(title: string, primaryBtnText: string, additionalCSSClasses?: string): Dialog}) => new Promise((resolve, reject) => {
        const dialog = generateDialog(title, i18n.t('phovea:ui.dismiss'), additionalCSSClasses);

        dialog.body.innerHTML = globalErrorTemplate(body);

        dialog.onSubmit(() => {
          dialog.hide();
          return false;
        });

        dialog.onHide(() => {
          reject(error);
          dialog.destroy();
        });

        dialog.show();
      }));
    }

    if (error instanceof Response || error.response instanceof Response) {
      const xhr: Response = error instanceof Response ? error : error.response;
      return xhr.text().then((body: string) => {
        const title = i18n.t('phovea:ui.errorHeader', {status: xhr.status, statusText: xhr.statusText});
        if (xhr.status !== 400) {
          body = `${body}<hr>
          ${i18n.t('phovea:ui.errorBody')}<br><a href="${xhr.url}" target="_blank">${(xhr.url.length > 100) ? xhr.url.substring(0, 100) + '...' : xhr.url}</a>`;
        }
        return commonDialog(title, body);
      });
    } else if (error instanceof Error) {
      return commonDialog(error.name, error.message);
    } else {
      return commonDialog(i18n.t('phovea:ui.unknownError'), error.toString());
    }
  }
}
