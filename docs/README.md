# Documentation

* [Reference](Reference.md)
* [Folder structure](#folder-structure)
* [Sitemap generation](#sitemap-generation)

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

Supply a `basePath` option when running Static2000 and it will generate an XML sitemap for the site. Pages with a `hidden` property set to `true` will not be included in the sitemap.
