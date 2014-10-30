# Documentation

* [Reference](Reference.md)
* [Folder structure](#folder-structure)

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
* `content` is where you define the content. Each page should be in its own folder and named index.jade and properties are defined using YAML front matter. One property is required: `template`, which specifies the template to use for rendering the page. The value should match an available file in the `templates` folder without the file extension.
