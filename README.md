# PoshlostiOS packages

This is the default repo for PPM in PoshlostiOS

## Contributing

You are welcome to make a pull requests to add your apps or fix already existing,
but you should follow the packaging design to get them successfully merged.

When you create a new package, add these required fields:

```json
{
  "name": "example",
  "version": "0.1.0",
  "description": "This is an example",
}
```

If you want to, you can also add `author`, `license` and `homepage` fields:

```json
{
  "name": "example",
  "version": "0.1.0",
  "description": "This is an example",
  "author": "MeexReay",
  "license": "WTFPL",
  "homepage": "https://github.com/MeexReay/ppm-app"
}
```

If it a custom license, please provide it as file `LICENSE` near the `package.json`.

When you change something in the existing package, don't forget to increase version (drop rel-version):

```diff
{
    "name": "poki",
+   "version": "0.1.1",
-   "version": "0.1.0+r1",
}
```

But if you didn't change anything in code, or for example just added some field
to `package.json` or updated default configs, then you have to increase rel-version:

```diff
{
    "name": "poki",
+   "version": "0.1.0+r2",
-   "version": "0.1.0+r1"
}
```
