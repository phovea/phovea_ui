import './jquery-global'; // we still need jquery, as a lot of code (especially CLUE uses jQuery)
// Bootstrap v3 import
// import 'bootstrap-sass/assets/javascripts/bootstrap.js';
// Mock some Bootstrap functions that we use from Bootstrap v3 to prevent errors
$.fn.modal = function () {
    return this;
};
$.fn.button = function () {
    return this;
};
// IMPORTANT: No import of Bootstrap v4 JavaScript code!
// Use `React Bootstrap` for Bootstrap v4 components.
// React Bootstrap comes with datavisyn/tdp_core.
//# sourceMappingURL=_bootstrap.js.map