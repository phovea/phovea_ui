Caleydo Bootstrap and Font Awesome ![Caleydo Web Client Plugin](https://img.shields.io/badge/Caleydo%20Web-Client%20Plugin-F47D20.svg)
=============================================

This plugin is a utility plugin for including [Bootstrap](http://getbootstrap.com/) and [Font Awesome](http://fontawesome.io) into an Caleydo Web application. In addition this repository includes the following modules:
 
 * an AJAX provider based on [jQuery](http://jquery.com/) in `ajax_adapter_jquery.ts`
 * a common header for application in `header.ts`
 * utility dialog generators in `dialogs.ts` 

Installation
------------

[Set up a virtual machine using Vagrant](http://www.caleydo.org/documentation/vagrant/) and run these commands inside the virtual machine:

```bash
./manage.sh clone Caleydo/caleydo_bootstrap_fontawesome
./manage.sh resolve
```

If you want this plugin to be dynamically resolved as part of another application of plugin, you need to add it as a peer dependency to the _package.json_ of the application or plugin it should belong to:

```bash
{
  "peerDependencies": {
    "caleydo_bootstrap_fontawesome": "*"
  }
}
```

***

<a href="https://caleydo.org"><img src="http://caleydo.org/assets/images/logos/caleydo.svg" align="left" width="200px" hspace="10" vspace="6"></a>
This repository is part of **[Caleydo Web](http://caleydo.org/)**, a platform for developing web-based visualization applications. For tutorials, API docs, and more information about the build and deployment process, see the [documentation page](http://caleydo.org/documentation/).
