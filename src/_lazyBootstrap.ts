import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';

export default function loadBootstrap(): Promise<JQueryStatic> {
  return Promise.all([
    System.import('imports-loader?jQuery=jquery!bootstrap-sass/assets/javascripts/bootstrap.js'),
    System.import('jquery')])
    .then((args) => args[1]);
}
