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

Edit ``rvt.cli.config.json`` file inside your project`s root directory.

```tsx
interface Configuration {
  componentGeneration?: {
    createScssModule?: boolean;
    createPropInterface?: boolean;
  };
}
```

## Commands

* [create-app](./docs/commands/create-app.md)
* [new](docs/commands/new.md)
* [init](docs/commands/init.md)
