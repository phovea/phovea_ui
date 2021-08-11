import './jquery-global'; // we still need jquery, as a lot of code (especially CLUE uses jQuery)
// Bootstrap v4 import
import 'bootstrap';
// Mock some Bootstrap functions that we use from Bootstrap v3 to prevent errors
// Commented out for now since we are importing bootsrap again
// $.fn.modal = function() {
//   return this;
// };
// $.fn.button = function() {
//   return this;
// };
// IMPORTANT: No import of Bootstrap v4 JavaScript code!
// Use `React Bootstrap` for Bootstrap v4 components.
// React Bootstrap comes with datavisyn/tdp_core.
//# sourceMappingURL=_bootstrap.js.map