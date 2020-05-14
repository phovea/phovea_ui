/** NOTE: Will be removed entirely after migration to Webpack 4 and the update of the properties
 * target and module in tsconfig.json
 */
import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';

export default function loadBootstrap(): Promise<JQueryStatic> {
  return Promise.all([
    System.import('imports-loader?jQuery=jquery!bootstrap-sass/assets/javascripts/bootstrap.js'),
    System.import('jquery')])
    .then((args) => args[1]);
}
