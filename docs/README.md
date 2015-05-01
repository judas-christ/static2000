# Documentation

* [Template adapters](#template-adapters)
* [Reference](Reference.md)
* [Folder structure](#folder-structure)
* [Sitemap generation](#sitemap-generation)
* [Global plugins](GlobalPlugins.md)
* [Model plugins](ModelPlugins.md)


## Template adapters

Since version 0.2.0, Static2000 does no longer include a template engine but instead requires you to install and specify a template adapter. At the moment there are two available:

* [static2000-jade](https://github.com/judas-christ/static2000-jade) for [jade](http://jade-lang.com/)
* [static2000-nunjucks](https://github.com/judas-christ/static2000-nunjucks) for [nunjucks](http://mozilla.github.io/nunjucks/)
* [static2000-swig](https://github.com/judas-christ/static2000-swig) for [swig](http://paularmstrong.github.io/swig)

Install the one you want to use with npm:

```bash
npm install static2000-jade
```

and set the `templateAdapter` option to the name of the adapter:

```bash
static2000 --templateAdapter static2000-nunjucks
```

or

```js
static2000({ templateAdapter: 'static2000-nunjucks' });
```

The default adapter name is `static2000-jade` so if you're using that, there's no need to specify it.


## Folder structure

The default folder structure for source and output files is:

```
www/
src/
|- templates/
|  |- includes/
|  |- layouts/
|- content/
```

* `www` is the default output folder.
* `src` is the default source folder.
* `templates` is where templates are stored. All files directly below this folder will be parsed and available to pages, files in subfolders will not. By default, `includes/globals.jade` is included in all templates and pages. Define mixins and other helpers in this file or in other files included in this file.
* `content` is where you define the content. Before version 0.1.3, files had to be placed in their own folder and named `index.jade`. In later versions, a file named `page.jade` in the `content` folder will create the page `page/index.html` in the output folder. Similarly, a file named `page.sub-page.jade` will become the page `page/sub-page/index.html`. The entire site structure may be built this way if desired. Properties are defined using YAML front matter. One property is required: `template`, which specifies the template to use for rendering the page. The value should match an available file in the `templates` folder without the file extension.


## Sitemap generation

Supply a `baseUrl` option when running Static2000 and it will generate an XML sitemap for the site. Pages with a `hidden` property set to `true` will not be included in the sitemap.

```bash
static2000 --baseUrl http://example.com
```

or

```js
static2000({ baseUrl: 'http://example.com' });
```
