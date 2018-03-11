# eslint-plugin-mixed-case

Plugin to support mixed case

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-mixed-case`:

```
$ npm install eslint-plugin-mixed-case --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-mixed-case` globally.

## Usage

Add `mixed-case` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "mixed-case"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "mixed-case/rule-name": 2
    }
}
```

## Supported Rules

* mixed-case

## License Notes
This plugin is licensed under the MIT license; it also contains portions of code from the [ESLint](https://eslint.org/) project, the license for which is available as `LICENSE.eslint`