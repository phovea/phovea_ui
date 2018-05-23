import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';

export default function loadBootstrap(): Promise<JQueryStatic> {
  return Promise.all([
    import('imports-loader?jQuery=jquery!bootstrap-sass/assets/javascripts/bootstrap.js'),
    import('jquery')])
    .then((args) => args[1]);
}
