/// <reference types="jquery" />
/** NOTE: Will be removed entirely after migration to Webpack 4 and the update of the properties
 * target and module in tsconfig.json
 */
import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';
export declare function loadBootstrap(): Promise<JQueryStatic>;
