# How to package

This is a guide for making a PPM package.

Fork this repository to be able to send your package upstream.

Make a folder for your package at root. Use name of your package. \
Make the `package.json` file, and provide required values:

```jsonc
{
  "name": "example_name", // it must be the same as folder name
  "version": "1.0.0"
}
```

Describe your app in the `description` field. \
Add the license and author to the `license` and `author` fields.

Then add the executables to the folder and to the `apps` field. \
If you have default configs, add them to the folder and to the `configs` field. \
Add package dependencies to the `depends` field.

If you still need some install fixes after apps and configs copied, you can use
`fixup` field for a list of commands after install, and `fixdown` for a list of
command that should be ran before uninstall \
The list of dependencies for these fields can be provided in the `fix_depends` field.

You can add your own fields to the `packages.json`, so they will display in `ppm s package`.
For example, some packages add the `homepage` field for the app homepage url.
