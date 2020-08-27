/// <reference types="jquery" />
/// <reference types="select2" />
/// <reference types="bootstrap" />
/**
 * Created by Samuel Gratzl on 19.11.2015.
 */
import '../webpack/_bootstrap';
export interface IDialogOptions {
    title?: string;
    placeholder?: string;
    primaryBtnText?: string;
    additionalCSSClasses?: string;
}
export interface IPromptOptions extends IDialogOptions {
    multiline?: boolean;
}
export interface IChooseOptions extends IDialogOptions {
    editable?: boolean;
}
export interface IAreYouSureOptions extends Pick<IDialogOptions, 'title' | 'additionalCSSClasses'> {
    button?: string;
    cancelButton?: string;
}
export declare class Dialog {
    protected readonly $dialog: JQuery;
    private bakKeyDownListener;
    static openDialogs: number;
    constructor(title: string, primaryBtnText?: string, additionalCSSClasses?: string);
    show(): JQuery<HTMLElement>;
    hide(): JQuery<HTMLElement>;
    get body(): HTMLElement;
    get footer(): HTMLElement;
    get header(): HTMLElement;
    onHide(callback: () => void): void;
    onSubmit(callback: () => any): JQuery<HTMLElement>;
    hideOnSubmit(): void;
    destroy(): JQuery<HTMLElement>;
    static generateDialog(title: string, primaryBtnText?: string, additionalCSSClasses?: string): Dialog;
    static msg(text: string, category?: string): Promise<void>;
    /**
     * simple prompt dialog
     * @param text
     * @param options
     * @returns {Promise}
     */
    static prompt(text: string, options?: IPromptOptions | string): Promise<string>;
}
export declare class FormDialog extends Dialog {
    private readonly formId;
    constructor(title: string, primaryBtnText?: string, formId?: string, additionalCSSClasses?: string);
    get form(): HTMLFormElement;
    getFormData(): FormData;
    onSubmit(callback: () => boolean): JQuery<HTMLElement>;
    /**
     * simple choose dialog
     * @param items
     * @param options
     * @returns {Promise}
     */
    static choose(items: string[], options?: IChooseOptions | string): Promise<string>;
    static areyousure(msg?: string, options?: IAreYouSureOptions | string): Promise<boolean>;
}
