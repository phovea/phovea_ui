DEPRECATED: phovea_ui 
=====================
[![Phovea][phovea-image]][phovea-url] [![NPM version][npm-image]][npm-url] [![Build Status][circleci-image]][circleci-url]

This plugin is a utility plugin for including [Bootstrap](http://getbootstrap.com/) and [Font Awesome](http://fontawesome.io) into an Phovea application. In addition this repository includes the following modules:
 
 * an AJAX provider based on [jQuery](http://jquery.com/) in `ajax_adapter_jquery.ts`
 * a common header for application in `header.ts`
 * utility dialog generators in `dialogs.ts`

### DEPRECATION Information
Please note that this project has been archived and is no longer being maintained. There is an active development under https://github.com/datavisyn/tdp_core and we will also contribute our future changes to it.

Installation
------------

```
git clone https://github.com/phovea/phovea_ui.git
cd phovea_ui
npm install
```

Testing
-------

```
npm test
```

Building
--------

```
npm run build
```



***

<a href="https://caleydo.org"><img src="http://caleydo.org/assets/images/logos/caleydo.svg" align="left" width="200px" hspace="10" vspace="6"></a>
This repository is part of **[Phovea](http://phovea.caleydo.org/)**, a platform for developing web-based visualization applications. For tutorials, API docs, and more information about the build and deployment process, see the [documentation page](http://phovea.caleydo.org).


[phovea-image]: https://img.shields.io/badge/Phovea-Client%20Plugin-F47D20.svg
[phovea-url]: https://phovea.caleydo.org
[npm-image]: https://badge.fury.io/js/phovea_ui.svg
[npm-url]: https://npmjs.org/package/phovea_ui
[circleci-image]: https://circleci.com/gh/phovea/phovea_ui.svg?style=shield
[circleci-url]: https://circleci.com/gh/phovea/phovea_ui
