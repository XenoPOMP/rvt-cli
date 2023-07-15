# 💬 RVT - CLI Reference

``rvt-cli`` lib was developed by me specially for [react-vite-template](https://github.com/XenoPOMP/react-vite-template).

For full help, execute this command:
```shell
rvt --help
```

## Install globally

For global usage, install CLI globally:
```shell
npm i rvt-cli@latest shelljs -g
```

Yarn global install util installs libs to Yarn`s special folder, so Node engine can not reach bin folder.

So you have to install these packages only by npm.

## Configuration
```tsx
interface Configuration {
  componentGeneration?: {
    createScssModule?: boolean;
    createPropInterface?: boolean;
  };
}
```

## Create app

This command is similar to ``create-react-app``, but it creates copy of my template instead.

## New

This command allows you to generate new entities inside project.

Syntax:

```yarn
rvt new <TYPE> <NAME> 
```

### Arguments
* TYPE - 'component' | 'ui'
* NAME - string


## Init

This command allows you to initialize special types of projects (like Chrome extension) based from your current project.

```yarn
rvt init <ENTITY>
```
### Arguments
* ENTITY - 'chrome-extension'

